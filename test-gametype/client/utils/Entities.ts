import { Entity, Game, Ped, Pickup } from '@nativewrappers/client';
import { ArrayRandom } from './Misc.js';

const AllPeds = [
  'a_f_y_hipster_01',
  'a_m_y_hipster_01',
  'a_f_y_hipster_02',
  'a_m_y_hipster_02',
  'a_f_y_hipster_03',
  'a_m_y_hipster_03',
  'a_f_y_hipster_04',
  's_f_y_hooker_01',
  's_f_y_hooker_02',
  's_f_y_hooker_03'
];

export const RandomPedModel = () => ArrayRandom(AllPeds);

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

export class Pickup2 extends Pickup {
  constructor(public Handle: number) {
    super(Handle);
  }
}

// Copied from @native-wrappers/client, but changed to conform to Entity type
export const getAllPickups = (): Pickup2[] => {
  const handles: number[] = GetGamePool('CPickup');
  const pickups: Pickup2[] = [];

  handles.forEach(handle => pickups.push(new Pickup2(handle)));

  return pickups;
};
