import { addSuggestion } from '../../Utils.js';

export {};

const command = (_source: number, args: string[], _raw: string) => {
  const [statHash] = args;

  console.log('StatGetBool', JSON.stringify(StatGetBool(statHash, -1)));
  console.log('StatGetBoolMasked', JSON.stringify(StatGetBoolMasked(statHash, 1, -1)));
  console.log('StatGetCancelSaveMigrationStatus', JSON.stringify(StatGetCancelSaveMigrationStatus()));
  console.log('StatGetDate', JSON.stringify(StatGetDate(statHash, -1, -1)));
  console.log('StatGetFloat', JSON.stringify(StatGetFloat(statHash, -1)));
  console.log('StatGetInt', JSON.stringify(StatGetInt(statHash, -1)));
  console.log('StatGetMaskedInt', JSON.stringify(StatGetMaskedInt(-1, -1, -1, -1)));
  console.log('StatGetNumberOfDays', JSON.stringify(StatGetNumberOfDays(statHash)));
  console.log('StatGetNumberOfHours', JSON.stringify(StatGetNumberOfHours(statHash)));
  console.log('StatGetNumberOfMinutes', JSON.stringify(StatGetNumberOfMinutes(statHash)));
  console.log('StatGetNumberOfSeconds', JSON.stringify(StatGetNumberOfSeconds(statHash)));
  console.log('StatGetPackedBoolMask', JSON.stringify(StatGetPackedBoolMask(-1)));
  console.log('StatGetPackedIntMask', JSON.stringify(StatGetPackedIntMask(-1)));
  console.log('StatGetPos', JSON.stringify(StatGetPos(-1, -1)));
};

RegisterCommand('statshow', command, false);
addSuggestion('statshow', 'Show various queries of a Stat Hash value for the Player.', [
  { name: 'statHash', help: 'GTA Stat Hash value' }
]);
