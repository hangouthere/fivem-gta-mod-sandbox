import { Game } from '@nativewrappers/client';
import { addSuggestion } from '../../utils/Messaging.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const ped = Game.PlayerPed;
  const player = Game.Player;

  console.log('Player IDs', player.Handle, player.ServerId, '|', ped.Handle);
  console.log('NetworkIsGameInProgress?', NetworkIsGameInProgress());
  console.log('NetworkIsPlayerAParticipant?', NetworkIsPlayerAParticipant(player.Handle));
  console.log('NetworkIsPlayerInMpCutscene?', NetworkIsPlayerInMpCutscene(player.Handle));
  console.log('IsPlayerSwitchInProgress?', IsPlayerSwitchInProgress());
  console.log('IsPlayerPlaying?', IsPlayerPlaying(player.Handle));
  console.log('IsPlayerDead?', player.IsDead);
  console.log('IsPlayerInCutscene?', IsPlayerInCutscene(player.Handle));
  console.log('IsPlayerControlOn?', IsPlayerControlOn(player.Handle));
  console.log('NetworkIsPlayerActive?', NetworkIsPlayerActive(player.Handle));
  console.log('--------------');
  console.log('GetEntityHealth?', ped.Health);
  console.log('DoesEntityExist?', ped.exists());
  console.log('IsPedDeadOrDying ?', IsPedDeadOrDying(ped.Handle, true));
  console.log('IsEntityDead?', ped.IsDead);
  console.log('IsPedAPlayer?', ped.IsPlayer);
  console.log('IsPedHuman?', ped.IsHuman);
  console.log('IsEntityAttached?', ped.isAttached());
  console.log('IsEntityVisible?', ped.IsVisible);
};

RegisterCommand('playerinfo', command, false);
addSuggestion('playerinfo', 'Get miscellaneous information about yourself');
