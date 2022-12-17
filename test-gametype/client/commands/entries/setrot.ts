import { Game } from '@nativewrappers/client';
import { addSuggestion } from '../../Utils.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const prevRotation = Game.PlayerPed.Rotation;
  const newY = parseInt(args[0] ?? prevRotation.y);

  Game.PlayerPed.Heading = newY;
  Game.PlayerPed.Rotation = prevRotation;
};

RegisterCommand('setrot', command, false);
addSuggestion('setrot', 'Just a quick play around with setting your PlayerPed rotation.', [
  { name: 'rotation', help: 'Rotation in degrees' }
]);
