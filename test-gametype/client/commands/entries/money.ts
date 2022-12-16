import { Wait } from '@nativewrappers/client';
import { Chat } from '../../Messaging.js';
import { Jobify } from '../../Utils.js';

export {};

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

  stopJob = Jobify(async () => {
    Chat('showing money');
    SetMultiplayerBankCash();
    SetMultiplayerWalletCash();
    await Wait(1000);
  });
};

RegisterCommand('show-money', command, false);
RegisterKeyMapping('show-money', 'Show Your Money on Screen', 'keyboard', 'M');
