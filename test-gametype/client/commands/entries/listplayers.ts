import { Game } from '@nativewrappers/client';
import { Chat } from '../../Messaging.js';
import { addSuggestion } from '../../Utils.js';

const command = async (_source: number, _args: string[], _raw: string) => {
  Chat(`Players Online: (${GetNumberOfPlayers()})`);
  for (let player of Game.playerList()) {
    Chat(` * ${player.Name}`);
  }
};

RegisterCommand('listplayers', command, false);
addSuggestion('listplayers', 'List current players on the server');
