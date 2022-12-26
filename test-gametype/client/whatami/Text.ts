import { Color, Entity } from '@nativewrappers/client';
import { CachedEntity } from '../utils/CachedEntity.js';
import { DrawOnScreen3D, FovScaledParams } from '../utils/Text';
import { WAIOptions } from './Options';

/*ignores next block (aka function)*/
const commonTextParams = (cacher: CachedEntity, pedDistance: number, color: string) => [
  `${color}Hash(ID):~b~ ${(cacher.original as Entity).Model.Hash} ~w~(~t~${cacher.original.Handle}~w~)`,
  `${color}Coords:~b~ ${cacher.original.Position.x.toFixed(3)} ~t~/~b~ ${cacher.original.Position.y.toFixed(
    3
  )} ~t~/~b~ ${cacher.original.Position.z.toFixed(3)}`,
  `${color}Distance:~b~ ${pedDistance.toFixed(3)}`
];

export const quickTextParams = (
  fovScaledParams: FovScaledParams,
  targetCacher: CachedEntity,
  pedDistance: number,
  gtaColorFormat: string,
  textLines: string[]
) => {
  const allLines = [...textLines, ...commonTextParams(targetCacher, pedDistance, gtaColorFormat)];

  allLines.forEach((textLine, lineNum) => {
    const scaledLine = lineNum * fovScaledParams.scale!;
    // Define an offset for each line (ie, lineNum index usage)
    let offset = (scaledLine * WAIOptions.textSettings.height + scaledLine * WAIOptions.textSettings.spacing) / 100;
    DrawOnScreen3D(textLine, fovScaledParams, offset, new Color(fovScaledParams.alpha, 255, 255, 255));
  });
};
