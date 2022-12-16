import { Color, Entity, Game, Ped, Point, Prop, Vehicle, World } from '@nativewrappers/client';
import { getAllPickups } from '../Utils/Entities.js';
import { FovScaledParams, GetFovScaledParams } from '../Utils/Text';
import { isInViewDistance, quickTextParams, WAIOptions, WAIShowState } from './helpers.js';

// TODO: Make configurable
const lightColor = new Color(255, 255, 0, 255);

export const drawText = async () => {
  let inDistanceOfPed,
    pedDistance,
    closestEntity,
    closestDistance = Number.MAX_SAFE_INTEGER;

  let zOffsetLight = 0,
    radiusLight = 10,
    offsetScaleVector: FovScaledParams;

  // Define active bounds to the View Distance donut
  const mmBounds = {
    min: WAIOptions.distance.min,
    max: WAIOptions.distance.max
  };

  // Choose an Entity Group to iterate over
  const entityList: Entity[] = {
    [WAIShowState.Props]: World.getAllProps(),
    [WAIShowState.Peds]: World.getAllPeds(),
    [WAIShowState.Pickups]: getAllPickups(),
    [WAIShowState.Vehicles]: World.getAllVehicles()
  }[WAIOptions.showState];

  // For every Entity...
  for (let entity of entityList) {
    [inDistanceOfPed, pedDistance] = isInViewDistance(entity);

    // Don't process if the Entity isn't in the View Distance of the Ped
    if (!inDistanceOfPed) {
      continue;
    }

    // Update Closest/Tracked Entity, but skip self
    if (entity.Handle !== Game.PlayerPed.Handle) {
      closestEntity = pedDistance < closestDistance ? entity : closestEntity;
      closestDistance = Math.min(closestDistance, pedDistance);
    }

    // Determine starting data for text
    const fovScaleVector = GetFovScaledParams(
      entity.Position,
      pedDistance,
      mmBounds,
      WAIOptions.fontScale,
      WAIOptions.alpha
    );

    // Depending on which option is shown, we want to display common information, with additional pertinent information
    switch (WAIOptions.showState) {
      case WAIShowState.Peds:
        if (!(entity instanceof Ped)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 2;
        radiusLight = 10;
        offsetScaleVector = {
          ...fovScaleVector,
          screen3dTo2d: new Point(fovScaleVector.screen3dTo2d.X - 0.05, fovScaleVector.screen3dTo2d.Y - 0.2)
        };

        // Display the text with quick options
        const isArmed = IsPedArmed(entity.Handle, 1 + 2 + 4);
        quickTextParams(offsetScaleVector, entity, pedDistance, '~o~', [
          `~o~Cash:~b~ ${entity.Money} ~o~Armed?: ${isArmed ? '~r~Yes~s~' : '~t~No~s~'}`
        ]);

        break;

      case WAIShowState.Vehicles:
        if (!(entity instanceof Vehicle)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 8;
        radiusLight = 20;
        // Display the text with quick options
        quickTextParams(fovScaleVector, entity, pedDistance, '~p~', [
          `~p~DisplayName:~b~ ${entity.DisplayName}`,
          `~p~Fuel:~b~ ${entity.FuelLevel} ~p~Health:~b~ ${entity.Health}`
        ]);

        break;

      case WAIShowState.Props:
        if (!(entity instanceof Prop)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaleVector, entity, pedDistance, '~p~', []);

        break;

      case WAIShowState.Pickups:
        if (!(entity instanceof Entity)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaleVector, entity, pedDistance, '~p~', []);

        break;
    }
  }

  // Mark closest entity to PlayerPed
  if (closestEntity) {
    // prettier-ignore
    DrawSpotLightWithShadow(
      // Location, offset by zOffsetLight
      closestEntity.Position.x,
      closestEntity.Position.y,
      closestEntity.Position.z + zOffsetLight,
      // Point down
      0, 0, -1,
      lightColor.r,
      lightColor.g,
      lightColor.b,
      //distance
      10,
      //brigthenss
      lightColor.a,
      //roundness
      1,
      radiusLight,
      //falloff
      100,
      //shadowId
      0
    );
  }
};
