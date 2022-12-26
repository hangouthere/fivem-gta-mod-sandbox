import {
  Color,
  Container,
  Entity,
  Game,
  Ped,
  Point,
  Prop,
  Screen,
  Size,
  Text,
  Vehicle,
  World
} from '@nativewrappers/client';
import { CachedEntity } from '../utils/CachedEntity.js';
import { getAllPickups } from '../utils/Entities.js';
import { JobManager } from '../utils/Jobs.js';
import { removeSuggestion } from '../utils/Messaging.js';
import { MinMax } from '../utils/Misc.js';
import { FovScaledParams, GetFovScaledParams } from '../utils/Text';
import { isInViewDistance, WAIOptions, WAIShowState } from './Options.js';
import { quickTextParams } from './Text';

// TODO: Make configurable
const lightColor = new Color(255, 255, 0, 255);

type EntityCache = {
  cacher: CachedEntity;
  pedDistance: number;
};

type OnScreenEntity = {
  entityCache: EntityCache;
  fovScaledParams: FovScaledParams;
};

let targetedEntity: EntityCache;
let cacheInViewDist: Set<EntityCache> = new Set();
let entitiesOnScreen: Set<OnScreenEntity> = new Set();

let jobMgr: JobManager | null;

export const StartJobs = () => {
  jobMgr = new JobManager();

  job_clearCommands();
  jobMgr.registerJob(job_detectInView, 1000);
  jobMgr.registerJob(job_detectOnScreen, 30);
  jobMgr.registerJob(job_drawEntityInfo);
  jobMgr.registerJob(job_drawStats);
};

export const StopJobs = () => {
  if (jobMgr) {
    jobMgr.stopAllJobs();
  }

  jobMgr = null;
};

const job_clearCommands = () => {
  const stopJob = jobMgr!.registerJob(
    () => {
      [
        '-wai_view_type_left',
        '-wai_view_type_right',
        '-wai_viewdist_min_inc',
        '-wai_viewdist_min_dec',
        '-wai_viewdist_max_inc',
        '-wai_viewdist_max_dec',
        '-wai_viewdist_inc_inc',
        '-wai_viewdist_inc_dec',
        '-wai_settings_reset'
      ].forEach(removeSuggestion);
    },
    1000,
    true
  );

  stopJob();
};

export const job_detectInView = async () => {
  // Choose an Entity Group to iterate over
  const entityCachers: CachedEntity[] = {
    [WAIShowState.Props]: World.getAllProps(),
    [WAIShowState.Peds]: World.getAllPeds(),
    [WAIShowState.Pickups]: getAllPickups(),
    [WAIShowState.Vehicles]: World.getAllVehicles()
  }[WAIOptions.showState].map(e => new CachedEntity(e));

  cacheInViewDist.clear();

  // For every Entity...
  for (let entityCacher of entityCachers) {
    const [inDistanceOfPed, pedDistance] = isInViewDistance(entityCacher);
    const entCache = { cacher: entityCacher, pedDistance };

    // Don't process if the Entity isn't in the View Distance of the Ped
    if (!inDistanceOfPed) {
      continue;
    }

    // Update Closest/Tracked Entity, but skip self
    if (entityCacher.cached.Handle !== Game.PlayerPed.Handle) {
      targetedEntity = !targetedEntity || pedDistance < targetedEntity.pedDistance ? entCache : targetedEntity;
    }

    cacheInViewDist.add(entCache);
  }
};

export const job_detectOnScreen = async () => {
  // Define active bounds to the View Distance donut
  const mmBounds: MinMax = {
    min: WAIOptions.distance.min,
    max: WAIOptions.distance.max
  };

  entitiesOnScreen.clear();

  // For every Entity...
  for (let cache of cacheInViewDist) {
    // Determine starting data for text
    const fovScaledParams = GetFovScaledParams(
      cache.cacher.original.Position,
      cache.pedDistance,
      mmBounds,
      WAIOptions.fontScale,
      WAIOptions.alpha
    );

    if (!fovScaledParams.onScreen) {
      continue;
    }

    entitiesOnScreen.add({
      fovScaledParams,
      entityCache: cache
    });
  }
};

const job_drawEntityInfo = async () => {
  let zOffsetLight = 0,
    radiusLight = 10,
    offsetScaleVector: FovScaledParams;

  for (let {
    fovScaledParams,
    entityCache: { cacher, pedDistance }
  } of entitiesOnScreen) {
    if (!cacher.original.exists()) {
      continue;
    }

    // Depending on which option is shown, we want to display common information, with additional pertinent information
    switch (WAIOptions.showState) {
      case WAIShowState.Peds:
        if (!(cacher.cached instanceof Ped)) {
          break;
        }

        const ped = cacher.original as Ped;

        // Define some offsets for a tighter design
        zOffsetLight = 2;
        radiusLight = 10;
        offsetScaleVector = {
          ...fovScaledParams,
          screen3dTo2d: new Point(fovScaledParams.screen3dTo2d!.X - 0.05, fovScaledParams.screen3dTo2d!.Y - 0.2)
        };

        // Display the text with quick options
        const isArmed = IsPedArmed(cacher.cached.Handle, 1 + 2 + 4);
        quickTextParams(offsetScaleVector, cacher, pedDistance, '~o~', [
          `~o~Cash:~b~ ${ped.Money} ~o~Armed?: ${isArmed ? '~r~Yes~s~' : '~t~No~s~'}`
        ]);

        break;

      case WAIShowState.Vehicles:
        if (!(cacher.cached instanceof Vehicle)) {
          break;
        }

        const veh = cacher.original as Vehicle;

        // Define some offsets for a tighter design
        zOffsetLight = 8;
        radiusLight = 20;
        // Display the text with quick options
        quickTextParams(fovScaledParams, cacher, pedDistance, '~p~', [
          `~p~DisplayName:~b~ ${cacher.cached.DisplayName}`,
          `~p~Fuel:~b~ ${veh.FuelLevel} ~p~Health:~b~ ${veh.Health}`
        ]);

        break;

      case WAIShowState.Props:
        if (!(cacher.cached instanceof Prop)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaledParams, cacher, pedDistance, '~p~', []);

        break;

      case WAIShowState.Pickups:
        if (!(cacher.cached instanceof Entity)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaledParams, cacher, pedDistance, '~p~', []);

        break;
    }
  }

  // Mark closest entity to PlayerPed
  if (false && targetedEntity) {
    // prettier-ignore
    DrawSpotLightWithShadow(
      // Location, offset by zOffsetLight
      targetedEntity.cacher.original.Position.x,
      targetedEntity.cacher.original.Position.y,
      targetedEntity.cacher.original.Position.z + zOffsetLight,
      // Point down
      0, 0, -1,
      lightColor.r,
      lightColor.g,
      lightColor.b,
      //distance
      10,
      //brigthenss
      lightColor.a,
      //roundness
      1,
      radiusLight,
      //falloff
      100,
      //shadowId
      0
    );
  }
};

const containerSize = new Size(500, 150);
const statsContainer = new Container(
  new Point(Screen.ScaledWidth - containerSize.width, Screen.Height - containerSize.height),
  containerSize,
  new Color(75, 0, 0, 0)
);
const statEntitiesTotal = new Text('', new Point(5, 0), 0.5);
const statEntitiesOnScreen = new Text('', new Point(5, 20), 0.5);
statsContainer.addItem(statEntitiesTotal);
statsContainer.addItem(statEntitiesOnScreen);
const job_drawStats = async () => {
  statEntitiesTotal.caption = 'Entities in View Distance: ' + cacheInViewDist.size;
  statEntitiesOnScreen.caption = 'Entities on screen: ' + entitiesOnScreen.size;
  statsContainer.draw();
};
