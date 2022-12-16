import { Game } from '@nativewrappers/client';
import { addSuggestion } from '../../Utils.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const prevRotation = Game.PlayerPed.Rotation;
  const newY = parseInt(args[0] ?? prevRotation.y);

  // TODO: See if this is working, and equivalent.
  // TODO: Determine if the prevRotation is necessary
  // GetEntityRotation(me.ped, 2);
  // SetEntityHeading(me.ped, newY);
  // SetEntityRotation(me.ped, z, x, y, 2, false);

  Game.PlayerPed.Heading = newY;
  Game.PlayerPed.Rotation = prevRotation;
};

RegisterCommand('setrot', command, false);
addSuggestion('setrot', 'Just a quick play around with setting your PlayerPed rotation.', [
  { name: 'rotation', help: 'Rotation in degrees' }
]);
