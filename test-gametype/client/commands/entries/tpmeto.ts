import { Game, Vehicle, VehicleSeat } from '@nativewrappers/client';
import { GetPedOrVehEntity, GetPlayerByName } from '../../utils/Entities.js';
import { addSuggestion, Alert, Chat } from '../../utils/Messaging.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const [targetPlayerName] = args;
  const targetPlayer = GetPlayerByName(targetPlayerName);

  if (!targetPlayer) {
    return Chat('Invalid Player Name: ' + targetPlayerName);
  }

  const targetEntity = GetPedOrVehEntity(targetPlayer.Ped);

  Alert(`Teleporting ${Game.Player.Name} to ${targetPlayer.Name}!`);

  // FIXME: Needs Cfx update!
  if (IsEntityAPed(targetEntity.Handle)) {
    Game.PlayerPed.Position = targetEntity.Position.addY(1);
  } else {
    const ent = targetEntity as Vehicle;
    if (ent.isSeatFree(VehicleSeat.Any)) {
      Game.PlayerPed.setIntoVehicle(ent, VehicleSeat.Any);
    } else {
      Chat(`${targetPlayer.Name} is in a Vehicle without an available seat!`);
    }
  }
};

RegisterCommand('tpmeto', command, false);
addSuggestion('tpmeto', 'Teleport yourself to another player. Use `listplayers` to get active players.', [
  { name: 'playerName', help: 'Player Name to teleport to' }
]);
