import { Game } from '@nativewrappers/client';
import { addSuggestion, ChatSelf } from '../../utils/Messaging.js';

const command = async (_source: number, _args: string[], _raw: string) => {
  ChatSelf(`Players Online: (${GetNumberOfPlayers()})`);
  for (let player of Game.playerList()) {
    ChatSelf(` * ${player.Name}`);
  }
};

RegisterCommand('listplayers', command, false);
addSuggestion('listplayers', 'List current players on the server');
