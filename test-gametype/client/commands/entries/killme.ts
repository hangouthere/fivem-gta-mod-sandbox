import { Game, Ped, Vector3 } from '@nativewrappers/client';
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

const command2 = async (_source: number, args: string[], _raw: string) => {
  const ped = new Ped(parseInt(args[0]));
  ped.Health = -100;
  const x = RandBetween(-7, 7);

  const direction = new Vector3(x, -13, 10);
  const rotation = Vector3.Zero;
  Game.PlayerPed.applyForceRelative(direction, rotation);
};

RegisterCommand('killplayer', command2, false);
addSuggestion('killplayer', 'Kill a PlayerPed');
