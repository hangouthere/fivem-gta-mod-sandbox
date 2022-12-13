export let playerIdMap: PlayerIdMap;
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

const BuildPlayerIdMap = (playerList: PlayerInfo[]) =>
  playerList.reduce((list, player) => {
    list[player.id] = player;
    return list;
  }, {} as PlayerIdMap);

const BuildPlayerNameMap = (playerList: PlayerInfo[]): Record<number, PlayerInfo> =>
  playerList.reduce((list, player) => {
    list[player.name.toLowerCase()] = player;
    return list;
  }, {} as PlayerNameMap);

export const UpdatePlayerMaps = () => {
  const players = BuildPlayerList();

  playerIdMap = BuildPlayerIdMap(players);
  playerNameMap = BuildPlayerNameMap(players);
};

import { PlayerIdMap, PlayerInfo, PlayerNameMap } from './utils.js';
