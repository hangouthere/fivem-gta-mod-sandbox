import { RandomPedModel } from './AllPeds.js';
import { Chat, SpawnCoords } from './utils.js';

const WELCOMES = [
  'Welcome to the party,',
  'Glad you could join us,',
  'Thanks for playing with us,',
  "Hey look - it's you,",
  'Watch out, here comes',
  'Lookin good,'
];

const spawnOpts = {
  x: 684.976,
  y: 573.848,
  z: 130.461,
  heading: 160
};

const onSpawn = async (spawnCoords: SpawnCoords) => {
  const chosenMsg = WELCOMES[Math.floor(Math.random() * WELCOMES.length)];

  const ped = PlayerPedId();
  const playerId = GetPlayerServerId(ped);
  const playerName = GetPlayerName(playerId);

  TaskGoStraightToCoord(ped, spawnCoords.x - 1, spawnCoords.y - 3, spawnCoords.z, 1.3, 5000, spawnCoords.heading!, 0);

  Chat(`${chosenMsg} ${playerName}`);
};

const gameTypeSetup = () => {
  globalThis.exports.spawnmanager.setAutoSpawnCallback(() => {
    const pedModel = RandomPedModel();

    globalThis.exports.spawnmanager.spawnPlayer(
      {
        ...spawnOpts,
        model: pedModel
      },
      onSpawn
    );
  });

  globalThis.exports.spawnmanager.setAutoSpawn(true);
  // globalThis.exports.spawnmanager.forceRespawn();

  const pedId = PlayerPedId();
  const serverId = GetPlayerServerId(pedId);

  const isPlayerDead = IsPlayerDead(pedId);

  console.log('Player IDs', serverId, pedId);
  console.log('IsEntityDead?', IsEntityDead(serverId), IsEntityDead(pedId));
  console.log('Is Player Dead?', IsPlayerDead(serverId), IsPlayerDead(pedId));
  console.log('IsPedAPlayer?', IsPedAPlayer(serverId), IsPedAPlayer(pedId));
  console.log('IsPedHuman?', IsPedHuman(serverId), IsPedHuman(pedId));
  console.log('IsEntityVisible?', IsEntityVisible(serverId), IsEntityVisible(pedId));
  console.log('IsEntityAttached?', IsEntityAttached(serverId), IsEntityAttached(pedId));
  console.log('NetworkIsPlayerActive?', NetworkIsPlayerActive(serverId), NetworkIsPlayerActive(pedId));
  console.log('DoesEntityExist?', DoesEntityExist(serverId), DoesEntityExist(pedId));
  console.log('IsPlayerControlOn?', IsPlayerControlOn(serverId), IsPlayerControlOn(pedId));

  if (isPlayerDead) {
    globalThis.exports.spawnmanager.forceRespawn();
  }

  console.log('Mod Restarted:', new Date());
};

on('onClientGameTypeStart', gameTypeSetup);
