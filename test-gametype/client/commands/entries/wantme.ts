import { Game } from '@nativewrappers/client';
import { addSuggestion } from '../../Utils.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const level = parseInt(args[0]) ?? 5;

  SetPlayerWantedLevel(Game.Player.Handle, level, false);
  SetPlayerWantedLevelNow(Game.Player.Handle, false);
};

RegisterCommand('wantme', command, false);
addSuggestion('wantme', 'Causally give yourself a wanted level.', [
  { name: 'wantedLevel', help: 'Set a Wanted Level, 0-5. Defaults to 5' }
]);
