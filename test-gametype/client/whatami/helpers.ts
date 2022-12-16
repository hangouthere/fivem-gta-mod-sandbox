import { Color, Entity, Game } from '@nativewrappers/client';
import { Chat } from '../Messaging.js';
import { Clamp } from '../Utils.js';
import { DrawOnScreen3D, FovScaledParams } from '../Utils/Text';
import { IsActive } from './index.js';

export enum WAIShowState {
  Peds,
  Pickups,
  Props,
  Vehicles
}

const DEFAULT_OPTS = {
  showState: WAIShowState.Peds,
  distance: {
    min: 0,
    max: 10,
    incrementer: 5
  },
  bounds: {
    min: 0,
    max: 500
  },
  alpha: {
    min: 100 / 255,
    max: 255 / 255
  },
  fontScale: {
    min: 0.3,
    max: 0.4
  },
  lineSettings: {
    height: 5,
    spacing: 0.75
  }
};

export let WAIOptions = JSON.parse(JSON.stringify(DEFAULT_OPTS)) as typeof DEFAULT_OPTS;

export const isInViewDistance = (target: Entity): [boolean, number] => {
  const dist = Game.PlayerPed.Position.distance(target.Position);
  const isInViewDistance = dist >= WAIOptions.distance.min && dist <= WAIOptions.distance.max;

  return [isInViewDistance, dist];
};

export const resetOptions = () => {
  WAIOptions = JSON.parse(JSON.stringify(DEFAULT_OPTS));

  Chat(`[WhatAmI] Reset all settings to their defaults!`);
};

export const adjustViewDistance = (offset: number = 1, isMax = true) => {
  const maxOrMin = isMax ? 'max' : 'min';
  const label = isMax ? 'Outer' : 'Inner';
  const absOffset = Math.abs(offset);

  WAIOptions.distance[maxOrMin] = Clamp(
    WAIOptions.distance[maxOrMin] + offset,
    isMax
      ? // Bound at either the min/max bounds, OR the psuedo-bounding view distance!
        WAIOptions.distance.min + absOffset //outter-min
      : Math.max(0, WAIOptions.bounds.min), //inner-min
    isMax
      ? // Bound at either the min/max bounds, OR the psuedo-bounding view distance!
        WAIOptions.bounds.max - absOffset //outer-max
      : WAIOptions.distance.max - absOffset //inner-max
  );

  Chat(`[WhatAmI] ${label} View Distance set to ${WAIOptions.distance[maxOrMin]} (${offset})`);
};

export const changeViewDistanceIncrementer = (offset: number = 1) => {
  if (!IsActive) {
    return;
  }

  WAIOptions.distance.incrementer += offset;

  Chat(`[WhatAmI] View Distance Incrementer set to ${WAIOptions.distance.incrementer}`);

  // Show on screen?
};

export const rotateShowState = (forward: boolean) => {
  const prev = WAIOptions.showState;
  let next = WAIOptions.showState;

  // Simple 2-way state machine
  switch (prev) {
    case WAIShowState.Props:
      next = forward ? WAIShowState.Peds : WAIShowState.Vehicles;
      break;
    case WAIShowState.Peds:
      next = forward ? WAIShowState.Pickups : WAIShowState.Props;
      break;
    case WAIShowState.Pickups:
      next = forward ? WAIShowState.Vehicles : WAIShowState.Peds;
      break;
    case WAIShowState.Vehicles:
      next = forward ? WAIShowState.Props : WAIShowState.Pickups;
      break;
  }

  WAIOptions.showState = next;
  Chat(
    `[WhatAmI] Tracking ${WAIShowState[next]} between ${WAIOptions.distance.min} and ${WAIOptions.distance.max} units`
  );
};

/*ignores next block (aka function)*/
// prettier-ignore
const commonTextParams = (entity: Entity, pedDistance: number, color: string) => [
  `${color}Hash(ID):~b~ ${entity.Model.Hash} ~w~(~t~${entity.Handle}~w~)`,
  `${color}Coords:~b~ ${entity.Position.x.toFixed(3)} ~t~/~b~ ${entity.Position.y.toFixed(3)} ~t~/~b~ ${entity.Position.z.toFixed(3)}`,
  `${color}Distance:~b~ ${pedDistance.toFixed(3)}`
];

export const quickTextParams = (
  fovScaledParams: FovScaledParams,
  targetEntity: Entity,
  pedDistance: number,
  gtaColorFormat: string,
  textLines: string[]
) => {
  const allLines = [...textLines, ...commonTextParams(targetEntity, pedDistance, gtaColorFormat)];

  allLines.forEach((textLine, lineNum) => {
    const scaledLine = lineNum * fovScaledParams.scale;
    // Define an offset for each line (ie, lineNum index usage)
    let offset = (scaledLine * WAIOptions.lineSettings.height + scaledLine * WAIOptions.lineSettings.spacing) / 100;
    DrawOnScreen3D(textLine, fovScaledParams, offset, new Color(fovScaledParams.alpha, 255, 255, 255));
  });
};
