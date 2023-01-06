import { Vector2, Vector3 } from '@nativewrappers/client';

export type MinMax = {
  min: number;
  max: number;
};

export const ArrayRandom = <T>(list: Array<T>) => list[Math.floor(Math.random() * list.length)];

export const RandBetween = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) =>
  Math.random() * (max - min) + min;

export const Clamp = (num: number, min: number, max: number) => (num <= min ? min : num >= max ? max : num);

export const Vector3To2 = (vec: Vector3) => new Vector2(vec.x, vec.y);
