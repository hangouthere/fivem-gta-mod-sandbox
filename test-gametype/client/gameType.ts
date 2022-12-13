import { RandomPedModel } from './AllPeds.js';
import { Me } from './PlayerMap.js';
import { Chat, SpawnCoords } from './Utils.js';

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
  const chosenMsg = WELCOMES[Math.floor(Math.random() * WELCOMES.length)];

  const me = Me();

  TaskGoStraightToCoord(
    me.ped,
    spawnCoords.x - 1,
    spawnCoords.y - 3,
    spawnCoords.z,
    1.3,
    5000,
    spawnCoords.heading!,
    0
  );

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
  // globalThis.exports.spawnmanager.forceRespawn();

  console.log('Mod Restarted:', new Date());
};

on('onClientGameTypeStart', gameTypeSetup);
