import { addSuggestion } from '../../utils/Messaging.js';
import { IsActive, Register, Unregister } from '../../whatami/index.js';

const command = async (_source: number, _args: string[], _raw: string) => (!IsActive ? Register() : Unregister());

RegisterCommand('whatami', command, false);
addSuggestion('whatami', 'Show information about objects in the world');
