import { Game } from '@nativewrappers/client';
import { addSuggestion, ChatSelf } from '../../utils/Messaging.js';

const command = async (_source: number, args: string[], _raw: string) => {
  ChatSelf(`Current Location: ${JSON.stringify(Game.PlayerPed.Position)}`);
  ChatSelf(`Current Rotation: ${Game.PlayerPed.Heading}`);
  ChatSelf(`Current Heading: ${JSON.stringify(Game.PlayerPed.Rotation)}`);
};

RegisterCommand('getpos', command, false);
addSuggestion('getpos', 'Get the positional data of the PlayerPed');
