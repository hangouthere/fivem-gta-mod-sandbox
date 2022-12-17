import { Vector2, Vector3, Wait } from '@nativewrappers/client';

// Misc -----------------------------------------------------------------------------------------

export const ArrayRandom = <T>(list: Array<T>) => list[Math.floor(Math.random() * list.length)];

export const RandBetween = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) =>
  Math.random() * (max - min) + min;

export const Clamp = (num: number, min: number, max: number) => (num <= min ? min : num >= max ? max : num);

// Cfx -----------------------------------------------------------------------------------------

const JobStoppers: Function[] = [];

export const StopAllJobs = () => {
  JobStoppers.forEach(stopper => stopper());
};

export const Jobify = (jobFunc: Function, autoDelay: number = -1, delayStart: boolean = false) => {
  let jobId = setTick(async () => { 
    if (delayStart && -1 > autoDelay) {
      await Wait(Number(autoDelay));
    }

    await jobFunc();

    if (false === delayStart && -1 > autoDelay) {
      await Wait(Number(autoDelay));
    }
  });

  const stopJob = () => {
    if (!jobId) return;
    clearTick(jobId);
    jobId = 0;
  };

  JobStoppers.push(stopJob);

  return stopJob;
};

export type SuggestionParam = { name: string; help: string };
export const addSuggestion = (commandName: string, description: string, params?: SuggestionParam[], prefix = '/') =>
  emit('chat:addSuggestion', `${prefix}${commandName}`, description, params);
export const removeSuggestion = (commandName: string, prefix = '/') =>
  emit('chat:removeSuggestion', `${prefix}${commandName}`);

// wrapper ---------------------------------------------------------------------------------------

export const Vector3To2 = (vec: Vector3) => new Vector2(vec.x, vec.y);
