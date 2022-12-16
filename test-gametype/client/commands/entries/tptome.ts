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

  Alert(`Teleporting ${targetPlayer.Name} to ${Game.Player.Name}!`);

  targetEntity.Position = Game.PlayerPed.Position;
};

RegisterCommand('tptome', command, false);
addSuggestion('tptome', 'Teleport another player to you. Use `listplayers` to get active players.', [
  { name: 'playerName', help: 'Player Name to teleport to you' }
]);
