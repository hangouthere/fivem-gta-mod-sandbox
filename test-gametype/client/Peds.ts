import { ArrayRandom } from './Utils.js';

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

export const EnablePvP = (pedId: number, enable: boolean) => {
  SetCanAttackFriendly(pedId, enable, enable);
  NetworkSetFriendlyFireOption(enable);
};
