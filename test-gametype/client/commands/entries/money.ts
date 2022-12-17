import { Wait } from '@nativewrappers/client';
import { JobManager } from '../../utils/Jobs.js';
import { Chat } from '../../utils/Messaging.js';

export { };

let stopJob: Function | null;
const command = async () => {
  if (stopJob) {
    Chat('hiding money');

    stopJob();
    await Wait(100);
    RemoveMultiplayerBankCash();
    RemoveMultiplayerWalletCash();
    stopJob = null;
    return;
  }

  stopJob = JobManager.RegisterGlobalJob(async () => {
    Chat('showing money');
    SetMultiplayerBankCash();
    SetMultiplayerWalletCash();
    await Wait(1000);
  });
};

RegisterCommand('show-money', command, false);
RegisterKeyMapping('show-money', 'Show Your Money on Screen', 'keyboard', 'M');
