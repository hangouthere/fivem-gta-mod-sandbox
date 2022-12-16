import { Game } from '@nativewrappers/client';
import { addSuggestion } from '../../Utils.js';

const command = async (_source: number, args: string[], _raw: string) => {
  console.log('Player IDs', Game.Player.Handle, Game.PlayerPed.Handle, Game.Player.ServerId);
  console.log('DoesEntityExist?', Game.PlayerPed.exists());
  console.log('IsPlayerDead?', Game.Player.IsDead);
  console.log('IsEntityDead?', Game.PlayerPed.IsDead);
  console.log('IsPedAPlayer?', Game.PlayerPed.IsPlayer);
  console.log('IsPedHuman?', Game.PlayerPed.IsHuman);
  console.log('IsEntityAttached?', Game.PlayerPed.isAttached());
  console.log('IsEntityVisible?', Game.PlayerPed.IsVisible);
  console.log('IsPlayerControlOn?', IsPlayerControlOn(Game.Player.Handle));
  console.log('NetworkIsPlayerActive?', NetworkIsPlayerActive(Game.Player.Handle));
};

RegisterCommand('playerinfo', command, false);
addSuggestion('playerinfo', 'Get miscellaneous information about yourself');
