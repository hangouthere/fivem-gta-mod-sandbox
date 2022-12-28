import { cacheInViewDist, entitiesOnScreen } from '.';
import { MinMax } from '../../utils/Misc.js';
import { GetFovScaledParams } from '../../utils/Text';
import { WAIOptions } from '../Options.js';

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
