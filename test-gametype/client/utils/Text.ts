import { Alignment, Color, Font, GameplayCamera, Point, Screen, Size, Text, Vector3 } from '@nativewrappers/client';
import { Clamp, MinMax } from './Misc';

export type LineSettings = {
  height: number;
  spacing: number;
};

export type FovScaledParams = {
  onScreen: boolean;
  screen3dTo2d: Point;
  scale: number;
  alpha: number;
};

export const GetFovScaledParams = (
  target: Vector3,
  pedDistance: number,
  mmDistanceBounds: MinMax,
  mmFontScale: MinMax,
  mmAlpha: MinMax
): FovScaledParams => {
  const [onScreen, x, y] = World3dToScreen2d(target.x, target.y, target.z);
  const screen3dTo2d = new Point(x, y);
  const fov = (1 / GameplayCamera.FieldOfView) * 100;

  const scale = Clamp(
    // Invert scale between the min/max scale
    1 - ((mmFontScale.max - mmFontScale.min) / pedDistance) * fov - mmFontScale.min,
    mmFontScale.min,
    mmFontScale.max
  );

  const alpha = Math.ceil(
    Clamp(
      // Invert scale between the min/max scale
      255 - 255 * (pedDistance / mmDistanceBounds.max),
      mmAlpha.min * 255,
      mmAlpha.max * 255
    )
  );

  return {
    alpha,
    onScreen,
    scale,
    screen3dTo2d
  };
};

export const DrawOnScreen3D = (
  text: string,
  { onScreen, screen3dTo2d, scale }: FovScaledParams,
  offset: number,
  fontColor = Color.fromRgb(255, 255, 255)
) => {
  if (!onScreen) {
    return;
  }

  const offsetPos = new Point(screen3dTo2d.X, screen3dTo2d.Y + offset);

  Text.draw(
    text,
    offsetPos,
    scale,
    fontColor,
    Font.ChaletLondon,
    Alignment.Left,
    true,
    true,
    new Size(Screen.ScaledWidth, Screen.Height),
    new Size(1, 1)
  );
};
