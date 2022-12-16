import { Game } from '@nativewrappers/client';
import { Alert, Chat } from '../../Messaging.js';
import { addSuggestion } from '../../Utils.js';
import { GetPedOrVehEntity, GetPlayerByName } from '../../Utils/Entities.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const [targetPlayerName] = args;
  const targetPlayer = GetPlayerByName(targetPlayerName);

  if (!targetPlayer) {
    return Chat('Invalid Player Name: ' + targetPlayerName);
  }

  const targetEntity = GetPedOrVehEntity(targetPlayer.Ped);

  Alert(`Teleporting ${Game.Player.Name} to ${targetPlayer.Name}!`);

  Game.PlayerPed.Position = targetEntity.Position;
};

RegisterCommand('tpmeto', command, false);
addSuggestion('tpmeto', 'Teleport yourself to another player. Use `listplayers` to get active players.', [
  { name: 'playerName', help: 'Player Name to teleport to' }
]);
