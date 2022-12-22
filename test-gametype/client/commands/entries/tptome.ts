import { Game, Ped, VehicleSeat } from '@nativewrappers/client';
import { GetPedOrVehEntity, GetPlayerByName } from '../../utils/Entities.js';
import { addSuggestion, Alert, Chat } from '../../utils/Messaging.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const [targetPlayerName] = args;
  const targetPlayer = GetPlayerByName(targetPlayerName);

  if (!targetPlayer) {
    return Chat('Invalid Player Name: ' + targetPlayerName);
  }

  const targetEntity = GetPedOrVehEntity(targetPlayer.Ped);

  Alert(`Teleporting ${targetPlayer.Name} to ${Game.Player.Name}!`);

  // FIXME: Needs Cfx update!
  if (Game.PlayerPed.isInAnyVehicle() && IsEntityAPed(targetEntity.Handle)) {
    const ent = targetEntity as Ped;
    const veh = Game.PlayerPed.CurrentVehicle!;
    if (veh.isSeatFree(VehicleSeat.Any)) {
      ent.setIntoVehicle(veh, VehicleSeat.Any);
    } else {
      Chat(`You are in a Vehicle without an available seat!`);
    }
  } else {
    targetEntity.Position = Game.PlayerPed.Position.addY(1);
  }
};

RegisterCommand('tptome', command, false);
addSuggestion('tptome', 'Teleport another player to you. Use `listplayers` to get active players.', [
  { name: 'playerName', help: 'Player Name to teleport to you' }
]);
