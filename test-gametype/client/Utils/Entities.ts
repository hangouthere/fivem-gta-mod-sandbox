import { Entity, Game, Ped } from '@nativewrappers/client';

export const GetPlayerByName = (playerName: string) => {
  for (let _player of Game.playerList()) {
    if (_player.Name.toLowerCase() === playerName.toLowerCase()) {
      return _player;
    }
  }

  return null;
};

export const GetPedOrVehEntity = (ped: Ped): Entity => {
  return ped.CurrentVehicle ?? ped;
};

// Copied from @native-wrappers/client, but changed to conform to Entity type
export const getAllPickups = (): Entity[] => {
  const handles: number[] = GetGamePool('CPickup');
  const pickups: Entity[] = [];

  handles.forEach(handle => pickups.push(new Entity(handle)));

  return pickups;
};
