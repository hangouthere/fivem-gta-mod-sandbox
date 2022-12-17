import { Game, Vector3 } from '@nativewrappers/client';
import { addSuggestion } from '../../utils/Messaging.js';
import { RandBetween } from '../../utils/Misc';

const command = async (_source: number, args: string[], _raw: string) => {
  Game.PlayerPed.Health = -100;
  const x = RandBetween(-7, 7);

  const direction = new Vector3(x, -13, 10);
  const rotation = Vector3.Zero;
  Game.PlayerPed.applyForceRelative(direction, rotation);
};

RegisterCommand('killme', command, false);
addSuggestion('killme', 'Kill the current PlayerPed');
