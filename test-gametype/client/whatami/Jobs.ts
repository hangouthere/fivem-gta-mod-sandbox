import { Color, Entity, Game, Ped, Point, Prop, Vehicle, World } from '@nativewrappers/client';
import { CachedEntity } from '../utils/CacheableEntities/test.js';
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
  entity: Entity;
  pedDistance: number;
};

type OnScreenEntity = {
  entityCache: EntityCache;
  fovScaledParams: FovScaledParams;
};

let targetedEntity: EntityCache;
let entitiesInViewDist: EntityCache[] = [];
let entitiesOnScreen: OnScreenEntity[] = [];

let jobMgr: JobManager | null;

export const StartJobs = () => {
  jobMgr = new JobManager();

  job_clearCommands();
  jobMgr.registerJob(job_detectInView, 5000);
  jobMgr.registerJob(job_detectOnScreen, 20);
  jobMgr.registerJob(job_drawText);
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
  const entityList: Entity[] = {
    [WAIShowState.Props]: World.getAllProps(),
    [WAIShowState.Peds]: World.getAllPeds(),
    [WAIShowState.Pickups]: getAllPickups(),
    [WAIShowState.Vehicles]: World.getAllVehicles()
  }[WAIOptions.showState].map(e => new CachedEntity(e).cached);

  entitiesInViewDist = [];

  // For every Entity...
  for (let entity of entityList) {
    const [inDistanceOfPed, pedDistance] = isInViewDistance(entity);
    const entCache = { entity, pedDistance };

    // Don't process if the Entity isn't in the View Distance of the Ped
    if (!inDistanceOfPed) {
      continue;
    }

    // Update Closest/Tracked Entity, but skip self
    if (entity.Handle !== Game.PlayerPed.Handle) {
      targetedEntity = !targetedEntity || pedDistance < targetedEntity.pedDistance ? entCache : targetedEntity;
    }

    entitiesInViewDist.push(entCache);
  }

  console.log(`Ent in View Dist: ${entitiesInViewDist.length}/${entityList.length}`);
};

export const job_detectOnScreen = async () => {
  // Define active bounds to the View Distance donut
  const mmBounds: MinMax = {
    min: WAIOptions.distance.min,
    max: WAIOptions.distance.max
  };

  entitiesOnScreen = [];

  // For every Entity...
  for (let entityCache of entitiesInViewDist) {
    // Determine starting data for text
    const fovScaledParams = GetFovScaledParams(
      entityCache.entity.Position,
      entityCache.pedDistance,
      mmBounds,
      WAIOptions.fontScale,
      WAIOptions.alpha
    );

    if (!fovScaledParams.onScreen) {
      continue;
    }

    entitiesOnScreen.push({
      fovScaledParams,
      entityCache
    });
  }

  console.log(`Ent on Screen: ${entitiesOnScreen.length}/${entitiesInViewDist.length}`);
};

const job_drawText = async () => {
  let zOffsetLight = 0,
    radiusLight = 10,
    offsetScaleVector: FovScaledParams;

  for (let {
    fovScaledParams,
    entityCache: { entity, pedDistance }
  } of entitiesOnScreen) {
    // Depending on which option is shown, we want to display common information, with additional pertinent information
    switch (WAIOptions.showState) {
      case WAIShowState.Peds:
        if (!(entity instanceof Ped)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 2;
        radiusLight = 10;
        offsetScaleVector = {
          ...fovScaledParams,
          screen3dTo2d: new Point(fovScaledParams.screen3dTo2d.X - 0.05, fovScaledParams.screen3dTo2d.Y - 0.2)
        };

        // Display the text with quick options
        const isArmed = IsPedArmed(entity.Handle, 1 + 2 + 4);
        quickTextParams(offsetScaleVector, entity, pedDistance, '~o~', [
          `~o~Cash:~b~ ${entity.Money} ~o~Armed?: ${isArmed ? '~r~Yes~s~' : '~t~No~s~'}`
        ]);

        break;

      case WAIShowState.Vehicles:
        if (!(entity instanceof Vehicle)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 8;
        radiusLight = 20;
        // Display the text with quick options
        quickTextParams(fovScaledParams, entity, pedDistance, '~p~', [
          `~p~DisplayName:~b~ ${entity.DisplayName}`,
          `~p~Fuel:~b~ ${entity.FuelLevel} ~p~Health:~b~ ${entity.Health}`
        ]);

        break;

      case WAIShowState.Props:
        if (!(entity instanceof Prop)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaledParams, entity, pedDistance, '~p~', []);

        break;

      case WAIShowState.Pickups:
        if (!(entity instanceof Entity)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaledParams, entity, pedDistance, '~p~', []);

        break;
    }
  }

  // Mark closest entity to PlayerPed
  if (targetedEntity) {
    // prettier-ignore
    DrawSpotLightWithShadow(
      // Location, offset by zOffsetLight
      targetedEntity.entity.Position.x,
      targetedEntity.entity.Position.y,
      targetedEntity.entity.Position.z + zOffsetLight,
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
