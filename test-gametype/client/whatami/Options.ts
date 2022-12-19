import { Entity, Game } from '@nativewrappers/client';
import { Chat } from '../utils/Messaging.js';
import { Clamp } from '../utils/Misc';
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
    max: 5000,
    // max: 10,
    // incrementer: 5
    incrementer: 100
  },
  bounds: {
    min: 0,
    max: 5000
    // max: 500
  },
  alpha: {
    min: 100 / 255,
    max: 255 / 255
  },
  fontScale: {
    min: 0.3,
    max: 0.4
  },
  textSettings: {
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
        WAIOptions.bounds.max //outer-max
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
  const prevState = WAIOptions.showState;
  let nextState = WAIOptions.showState;

  nextState = {
    [WAIShowState.Props]: (nextState = forward ? WAIShowState.Peds : WAIShowState.Vehicles),
    [WAIShowState.Peds]: (nextState = forward ? WAIShowState.Pickups : WAIShowState.Props),
    [WAIShowState.Pickups]: (nextState = forward ? WAIShowState.Vehicles : WAIShowState.Peds),
    [WAIShowState.Vehicles]: (nextState = forward ? WAIShowState.Props : WAIShowState.Pickups)
  }[prevState];

  WAIOptions.showState = nextState;
  Chat(
    `[WhatAmI] Tracking ${WAIShowState[nextState]} between ${WAIOptions.distance.min} and ${WAIOptions.distance.max} units`
  );
};
