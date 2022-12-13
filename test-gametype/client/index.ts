import './commands.js';
import { EnablePvP, RandomPedModel } from './Peds.js';
import { Me, UpdatePlayerMaps } from './PlayerMap.js';
import { ArrayRandom, Chat, Delay, SpawnCoords } from './Utils.js';

setTick(async () => {
  UpdatePlayerMaps();
  await Delay(100);
});

const WELCOMES = [
  'Welcome to the party,',
  'Glad you could join us,',
  'Thanks for playing with us,',
  "Hey look - it's you,",
  'Watch out, here comes',
  'Lookin good,'
];

const SpawnOpts = {
  x: 684.976,
  y: 573.848,
  z: 130.461,
  heading: 160
};

const onSpawn = async (spawnCoords: SpawnCoords) => {
  const chosenMsg = ArrayRandom(WELCOMES);
  const me = Me();

  TaskGoStraightToCoord(me.ped, spawnCoords.x - 1, spawnCoords.y - 3, spawnCoords.z, 1.3, -1, spawnCoords.heading!, 0);
  SetPedKeepTask(me.ped, true);

  EnablePvP(me.ped, true);

  Chat(`${chosenMsg} ${me.name}`);
};

const gameTypeSetup = () => {
  globalThis.exports.spawnmanager.setAutoSpawnCallback(() => {
    const pedModel = RandomPedModel();

    globalThis.exports.spawnmanager.spawnPlayer(
      {
        ...SpawnOpts,
        model: pedModel
      },
      onSpawn
    );
  });

  globalThis.exports.spawnmanager.setAutoSpawn(true);
  globalThis.exports.spawnmanager.forceRespawn();

  console.log('Mod Restarted:', new Date());
};

on('onClientGameTypeStart', gameTypeSetup);
