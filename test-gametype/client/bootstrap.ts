import { Game, Vector3 } from '@nativewrappers/client';
import { RandomPedModel } from './utils/Entities.js';
import iconPlayerJoin from './utils/icons/icon-player-join.js';
import { ChatAll, ChatSelf } from './utils/Messaging.js';
import { ArrayRandom } from './utils/Misc';

const WELCOMES = [
  'Welcome to the party,',
  'Glad you could join us,',
  'Thanks for playing with us,',
  "Hey look - it's you,",
  'Watch out, here comes',
  'Lookin good,'
];

const SpawnOpts = new Vector3(684.976, 573.848, 130.461);
const SpawnHeading = 160;
const WalkToOffset = SpawnOpts.add(new Vector3(-1, -3, 0));

const onSpawn = async () => {
  const chosenMsg = ArrayRandom(WELCOMES);

  // Make character walk forward
  TaskGoStraightToCoord(
    Game.PlayerPed.Handle,
    WalkToOffset.x,
    WalkToOffset.y,
    WalkToOffset.z,
    1.3,
    -1,
    SpawnHeading,
    0
  );

  SetPedKeepTask(Game.PlayerPed.Handle, true);

  Game.Player.PvPEnabled = true;

  ChatAll("Say Hi to me, I'm important!");
  ChatSelf(`${chosenMsg} ${Game.Player.Name}`, 'nfg-player-joined');
};

const setupSpawner = () => {
  globalThis.exports.spawnmanager.setAutoSpawnCallback(() => {
    const pedModel = RandomPedModel();

    globalThis.exports.spawnmanager.spawnPlayer(
      {
        ...SpawnOpts,
        heading: SpawnHeading,
        model: pedModel
      },
      onSpawn
    );
  });

  globalThis.exports.spawnmanager.setAutoSpawn(true);

  // If we're at 0,0,0 (aka fresh connect as Michael), force a spawn!
  const playerZero = GetHashKey('player_zero');

  if (playerZero === Game.PlayerPed.Model.Hash && Game.PlayerPed.Position.distance(Vector3.Zero) <= 1) {
    globalThis.exports.spawnmanager.forceRespawn();

    ShutdownLoadingScreenNui(); // Just in case
  }
};

const setupChat = () => {
  emit(
    'chat:addTemplate',
    'nfg-player-joined',
    `<span class="nfg-player-joined">${iconPlayerJoin}<span class="nfg-player-name">{0}:</span> <span class="nfg-player-message">{1}</span></span>`
  );
};

export const bootstrapGameType = async () => {
  setupSpawner();
  setupChat();

  console.log('[Sandbox] Mod Started:', new Date());
};
