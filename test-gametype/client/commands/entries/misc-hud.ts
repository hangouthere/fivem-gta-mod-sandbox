import { Hud, Wait } from '@nativewrappers/client';
import { removeSuggestion } from '../../utils/Messaging.js';

export {};

let stopJobMoney: boolean;

const cmdMoney = async () => {
  if (stopJobMoney) {
    await Wait(0);
    RemoveMultiplayerBankCash();
    RemoveMultiplayerWalletCash();
    stopJobMoney = false;
    return;
  }

  stopJobMoney = true;
  await Wait(0);
  SetMultiplayerBankCash();
  SetMultiplayerWalletCash();
};

let toggleRadar = Hud.IsRadarVisible;
const cmdRadar = async () => {
  toggleRadar = !toggleRadar;
  Hud.IsRadarVisible = toggleRadar;
};

RegisterCommand('-show-money', cmdMoney, false);
RegisterKeyMapping('-show-money', 'Show Your Money on Screen', 'keyboard', 'M');

RegisterCommand('-show-radar', cmdRadar, false);
RegisterKeyMapping('-show-radar', 'Show Your Radar on Screen', 'keyboard', 'U');

setTimeout(() => {
  ['-show-money', '-show-radar'].forEach(removeSuggestion);
}, 1000);
