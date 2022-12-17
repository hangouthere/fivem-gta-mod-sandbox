import { Wait } from '@nativewrappers/client';

export type StopJobFunction = Function;

/**
 * JobManager
 *
 * Convenient handling for jobs, isolated and globally registered!
 *
 * Each instance of a JobManager registers all calls with a central register, to ensure ALL jobs are stopped if necessary.
 *
 * You can stop all jobs registered to a single JobManager as well, which is convenient for isolating portions of your Resources.
 */
export class JobManager {
  /*
  Static Methods
*/

  protected static jobStoppers: Function[] = [];

  /**
   * Register a Global Job.
   *
   * Useful for one-off jobs that don't require collective/grouped handling.
   *
   * @param jobFunc Function to process every possible tick
   * @param autoDelay Amount of time to automatically delay before or after your `jobFunc`
   * @param delayStart Whether to apply the delay before or after your `jobFunc`
   * @returns StopJobFunction A function that when executed will clear the job from being scheduled
   */
  public static RegisterGlobalJob(
    jobFunc: Function,
    autoDelay: number = -1,
    delayStart: boolean = false
  ): StopJobFunction {
    let jobId = setTick(async () => {
      // Prestart delay
      if (delayStart && -1 > autoDelay) {
        await Wait(Number(autoDelay));
      }

      // Do the job :P
      await jobFunc();

      // Post delay
      if (false === delayStart && -1 > autoDelay) {
        await Wait(Number(autoDelay));
      }
    });

    // Simple cancel/stop job handler
    const stopJob = () => {
      if (!jobId) return;
      clearTick(jobId);
    };

    this.jobStoppers.push(stopJob);

    return stopJob;
  }

  /**
   * Stops ALL Global Jobs, regardless of how they're registered
   */
  public static StopAllGlobalJobs() {
    this.jobStoppers.forEach(stopper => stopper());
    this.jobStoppers = [];
  }

  /*
  Instance Methods
 */
  protected jobsStoppers: Function[] = [];

  /**
   * Proxy to JobManager.RegisterGlobalJob, and also persists the jobStopper locally for grouping jobs
   *
   * @see JobManager.RegisterGlobalJob
   */
  public registerJob(jobFunc: Function, autoDelay: number = -1, delayStart: boolean = false) {
    const jobStopper = JobManager.RegisterGlobalJob(jobFunc, autoDelay, delayStart);

    this.jobsStoppers.push(jobStopper);

    return jobStopper;
  }

  /**
   * Stops all jobs registered with this instance of JobManager
   */
  public stopAllJobs = () => {
    this.jobsStoppers.forEach(stopper => stopper());
    this.jobsStoppers = [];
  };
}
