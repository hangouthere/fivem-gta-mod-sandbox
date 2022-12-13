import './commands.js';
import './gameType.js';
import { UpdatePlayerMaps } from './PlayerMap.js';
import { Delay } from './Utils.js';

setTick(async () => {
  UpdatePlayerMaps();
  await Delay(100);
});
