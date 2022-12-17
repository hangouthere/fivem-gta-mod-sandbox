export const ArrayRandom = <T>(list: Array<T>) => list[Math.floor(Math.random() * list.length)];

export const RandBetween = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) =>
  Math.random() * (max - min) + min;

export const Clamp = (num: number, min: number, max: number) => (num <= min ? min : num >= max ? max : num);
