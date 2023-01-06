import { Color } from '@nativewrappers/client';
import { CachedEntity } from '../../utils/CachedEntity.js';
import { JobManager } from '../../utils/Jobs.js';
import { FovScaledParams } from '../../utils/Text';
import { job_clearKeybindCommands } from './ClearKeybindCommands';
import { job_detectOnScreen } from './DetectOnScreen';
import { job_detectWithinViewDist } from './DetectWithinViewDist';
import { job_drawEntityInfo } from './DrawEntityInfo';
import { job_drawStats } from './DrawStats';

// TODO: Make configurable
export const lightColor = new Color(255, 255, 0, 255);

export type EntityCache = {
  cacher: CachedEntity;
  pedDistance: number;
};

type OnScreenEntity = {
  entityCache: EntityCache;
  fovScaledParams: FovScaledParams;
};

export let entitiesInViewDist: Set<EntityCache> = new Set();
export let entitiesOnScreen: Set<OnScreenEntity> = new Set();

let jobMgr: JobManager | null;

export const StartJobs = () => {
  jobMgr = new JobManager();

  job_clearKeybindCommands();
  jobMgr.registerJob(job_drawStats);
  jobMgr.registerJob(job_detectWithinViewDist, 100);
  jobMgr.registerJob(job_detectOnScreen, 30);
  jobMgr.registerJob(job_drawEntityInfo);
};

export const StopJobs = () => {
  if (jobMgr) {
    jobMgr.stopAllJobs();
  }

  jobMgr = null;
};
