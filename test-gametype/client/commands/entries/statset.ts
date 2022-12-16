import { addSuggestion } from '../../Utils.js';

export {};

const command = (_source: number, args: string[], _raw: string) => {
  const [type, statHash, statValue] = args;

  switch (type) {
    case 'bool':
    case 'boolean':
      StatSetBool(statHash, !!statValue, true);
      break;
    case 'int':
      StatSetInt(statHash, parseInt(statValue), true);
      break;
    case 'float':
      StatSetFloat(statHash, parseFloat(statValue), true);
      break;
    default:
      break;
  }
};

RegisterCommand('statset', command, false);
addSuggestion('statset', 'Set a Stat value for the Player', [
  { name: 'type', help: 'Type of Stat to set: boolean, int, or float' },
  { name: 'statHash', help: 'GTA Stat Hash value' },
  { name: 'statValue', help: 'The stored value to set for the Stat' }
]);
