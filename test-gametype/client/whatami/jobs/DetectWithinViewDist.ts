import { Game, World } from '@nativewrappers/client';
import { entitiesInViewDist, EntityCache } from '.';
import { CachedEntity } from '../../utils/CachedEntity.js';
import { getAllPickups } from '../../utils/Entities.js';
import { isInViewDistance, WAIOptions, WAIShowState } from '../Options.js';

export let targetedEntity: EntityCache;

export const job_detectWithinViewDist = async () => {
  // Choose an Entity Group to iterate over
  const entityCachers: CachedEntity[] = {
    [WAIShowState.Props]: World.getAllProps(),
    [WAIShowState.Peds]: World.getAllPeds(),
    [WAIShowState.Pickups]: getAllPickups(),
    [WAIShowState.Vehicles]: World.getAllVehicles()
  }[WAIOptions.showState].map(e => new CachedEntity(e));

  let foundEntities: EntityCache[] = [];

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

    foundEntities.push(entCache);
  }

  // Do the sort!
  let sortedEntities = [...foundEntities].sort((a, b) => (b.pedDistance < a.pedDistance ? -1 : 1));

  // Store in our Set
  entitiesInViewDist.clear();
  sortedEntities.forEach(e => entitiesInViewDist.add(e));
};
