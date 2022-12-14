import { PlayerIdMap, PlayerInfo, PlayerNameMap, PlayerPedMap } from './Peds.js';

export let playerIdMap: PlayerIdMap;
export let playerPedMap: PlayerPedMap;
export let playerNameMap: PlayerNameMap;

const BuildPlayerList = (): PlayerInfo[] => {
  const playerNums = GetActivePlayers() as number[];

  return playerNums.map(playerId => ({
    id: playerId,
    serverId: GetPlayerServerId(playerId),
    name: GetPlayerName(playerId),
    ped: GetPlayerPed(playerId)
  }));
};

const BuildMaps = (playerList: PlayerInfo[]) => {
  playerIdMap = {};
  playerPedMap = {};
  playerNameMap = {};

  playerList.forEach(player => {
    playerIdMap[player.id] = player;
    playerPedMap[player.ped] = player;
    playerNameMap[player.name.toLowerCase()] = player;
  });
};

export const ValidatePlayer = (target: string) => {
  if (!target) {
    console.error('Missing Player');
    return false;
  }

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

export const UpdatePlayerMaps = () => BuildMaps(BuildPlayerList());
export const Me = () => playerPedMap[PlayerPedId()];
