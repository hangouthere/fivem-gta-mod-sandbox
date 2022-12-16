import './commands/index.js';
import { GameTypeSetup } from './GameType.js';

on('onClientGameTypeStart', GameTypeSetup);
