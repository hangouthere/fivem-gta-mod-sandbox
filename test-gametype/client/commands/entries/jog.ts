import { AnimationFlags, Game, LoadAnimDict, TaskSequence, Vector3 } from '@nativewrappers/client';
import { JobManager } from '../../utils/Jobs.js';
import { addSuggestion } from '../../utils/Messaging.js';
import { ArrayRandom } from '../../utils/Misc';

let stopJob: Function;
const toggleJob = () => {
  // Don't let the job run twice
  if (stopJob) return;

  stopJob = JobManager.RegisterGlobalJob(() => {
    /// Job is done!
    if (-1 == Game.PlayerPed.TaskSequenceProgress) {
      console.log('Finished');
      stopJob();
    }
  }, 100);
};

const command = async (_source: number, _args: string[], _raw: string) => {
  const jogDest = new Vector3(627.027, 523.261, 135.046);

  const animDict = 'anim@amb@nightclub@dancers@black_madonna_entourage@';
  const animName = ArrayRandom([
    'hi_dance_facedj_09_v2_male^5',
    'li_dance_facedj_11_v1_male^1',
    'li_dance_facedj_15_v2_male^2'
  ]);

  await LoadAnimDict(animDict);

  const taskSeq = new TaskSequence();
  taskSeq.AddTask?.goTo(jogDest, false, -1, 2);
  await taskSeq.AddTask?.playAnimation(animDict, animName, 3, 1, -1, 0, AnimationFlags.CancelableWithMovement);
  Game.PlayerPed.Task?.performSequence(taskSeq);

  toggleJob();
};

RegisterCommand('jog', command, false);
addSuggestion('jog', 'Force the PlayerPed to jog to a specified location');
