import { playerNameMap, UpdatePlayerMaps } from './PlayerMap.js';
import { Alert, Chat, GetPedOrVehId } from './utils.js';

RegisterCommand(
  'killme',
  async (_source: number, args: string[], _raw: string) => {
    const ped = PlayerPedId();

    SetEntityHealth(ped, 0);
  },
  false
);

RegisterCommand(
  'getpos',
  async (_source: number, args: string[], _raw: string) => {
    const ped = PlayerPedId();
    const pedLocation = GetEntityCoords(ped, true);
    const pedRotation = GetEntityRotation(ped, 2);
    Chat(`Current Location: ${pedLocation}`);
    Chat(`Current Rotation: ${pedRotation}`);
  },
  false
);

RegisterCommand(
  'setrot',
  async (_source: number, args: string[], _raw: string) => {
    const ped = PlayerPedId();
    const [z, x, y] = GetEntityRotation(ped, 2);
    const newY = parseInt(args[0] ?? y);

    SetEntityHeading(ped, newY);
    SetEntityRotation(ped, z, x, y, 2, false);
  },
  false
);

RegisterCommand(
  'listplayers',
  async (_source: number, args: string[], _raw: string) => {
    UpdatePlayerMaps();

    Chat('Players Online:');
    Object.keys(playerNameMap).forEach(name => {
      Chat('   ' + name);
    });
  },
  false
);

const validatePlayer = (target: string) => {
  if (!target) {
    console.error('Missing Player');
    return false;
  }

  UpdatePlayerMaps();

  const selfPedId = PlayerPedId();
  const targetPlayer = playerNameMap[target.toLowerCase()];

  if (!targetPlayer) {
    console.error('Invalid Player!');
    return false;
  }

  if (selfPedId == targetPlayer.ped) {
    console.error("You can't teleport to yourself!");
    return false;
  }

  return targetPlayer;
};

RegisterCommand(
  'tptome',
  async (_source: number, args: string[], _raw: string) => {
    const targetPlayerName = args[0];
    const targetPlayer = validatePlayer(targetPlayerName);

    if (!targetPlayer) {
      return;
    }

    const ped = PlayerPedId();
    const myName = GetPlayerName(ped);
    const [x, y, z] = GetEntityCoords(ped, true);

    const targetPedId = GetPedOrVehId(targetPlayer.ped);

    Alert(`Teleporting ${targetPlayer.name}(${targetPlayer.ped}) to ${myName}(${ped})!`);

    SetEntityCoords(targetPedId, x, y, z, false, false, false, false);
  },
  false
);

RegisterCommand(
  'tpmeto',
  async (_source: number, args: string[], _raw: string) => {
    const targetPlayerName = args[0];
    const targetPlayer = validatePlayer(targetPlayerName);

    if (!targetPlayer) {
      return;
    }

    const ped = PlayerPedId();
    const myName = GetPlayerName(ped);

    const targetPedId = GetPedOrVehId(targetPlayer.ped);
    const [x, y, z] = GetEntityCoords(targetPedId, true);

    Alert(`Teleporting ${myName}(${ped}) to ${targetPlayer.name}(${targetPlayer.ped})!`);

    SetEntityCoords(ped, x, y, z, false, false, false, false);
  },
  false
);
