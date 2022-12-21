import { Color, Entity } from '@nativewrappers/client';
import { DrawOnScreen3D, FovScaledParams } from '../utils/Text';
import { WAIOptions } from './Options';

/*ignores next block (aka function)*/
const commonTextParams = (entity: Entity, pedDistance: number, color: string) => [
  `${color}Hash(ID):~b~ ${entity.Model.Hash} ~w~(~t~${entity.Handle}~w~)`,
  `${color}Coords:~b~ ${entity.Position.x.toFixed(3)} ~t~/~b~ ${entity.Position.y.toFixed(
    3
  )} ~t~/~b~ ${entity.Position.z.toFixed(3)}`,
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
    let offset = (scaledLine * WAIOptions.textSettings.height + scaledLine * WAIOptions.textSettings.spacing) / 100;
    DrawOnScreen3D(textLine, fovScaledParams, offset, new Color(fovScaledParams.alpha, 255, 255, 255));
  });
};
