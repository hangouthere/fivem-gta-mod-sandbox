import './commands/index.js';
import { bootstrapGameType } from './bootstrap.js';
import { JobManager } from './utils/Jobs.js';

on('onClientGameTypeStart', bootstrapGameType);

on('onResourceStop', (resourceName: string) => {
  if (GetCurrentResourceName() != resourceName) {
    return;
  }

  if (0 < JobManager.numJobs) {
    console.log(`Auto-Stopping ${JobManager.numJobs} Jobs`);
    JobManager.StopAllGlobalJobs();
  }
  console.log(`The resource ${resourceName} has been stopped.`);
});
