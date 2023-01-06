import { Entity, Ped, Point, Prop, Vehicle } from '@nativewrappers/client';
import { entitiesOnScreen, lightColor } from '.';
import { FovScaledParams } from '../../utils/Text';
import { WAIOptions, WAIShowState } from '../Options.js';
import { quickTextParams } from '../Text';
import { targetedEntity } from './DetectWithinViewDist.js';

export const job_drawEntityInfo = async () => {
  let zOffsetLight = 0,
    radiusLight = 10,
    offsetScaleVector: FovScaledParams;

  for (let {
    fovScaledParams,
    entityCache: { cacher, pedDistance }
  } of entitiesOnScreen) {
    if (!cacher.original.exists()) {
      continue;
    }

    // Depending on which option is shown, we want to display common information, with additional pertinent information
    switch (WAIOptions.showState) {
      case WAIShowState.Peds:
        if (!(cacher.cached instanceof Ped)) {
          break;
        }

        const ped = cacher.original as Ped;

        // Define some offsets for a tighter design
        zOffsetLight = 2;
        radiusLight = 10;
        offsetScaleVector = {
          ...fovScaledParams,
          screen3dTo2d: new Point(fovScaledParams.screen3dTo2d!.X - 0.05, fovScaledParams.screen3dTo2d!.Y - 0.2)
        };

        // Display the text with quick options
        const isArmed = IsPedArmed(cacher.cached.Handle, 1 + 2 + 4);
        quickTextParams(offsetScaleVector, cacher, pedDistance, '~o~', [
          `~o~Cash:~b~ ${ped.Money} ~o~Armed?: ${isArmed ? '~r~Yes~s~' : '~t~No~s~'}`
        ]);

        break;

      case WAIShowState.Vehicles:
        if (!(cacher.cached instanceof Vehicle)) {
          break;
        }

        const veh = cacher.original as Vehicle;

        // Define some offsets for a tighter design
        zOffsetLight = 8;
        radiusLight = 20;
        // Display the text with quick options
        quickTextParams(fovScaledParams, cacher, pedDistance, '~p~', [
          `~p~DisplayName:~b~ ${cacher.cached.DisplayName}`,
          `~p~Fuel:~b~ ${veh.FuelLevel} ~p~Health:~b~ ${veh.Health}`
        ]);

        break;

      case WAIShowState.Props:
        if (!(cacher.cached instanceof Prop)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaledParams, cacher, pedDistance, '~p~', []);

        break;

      case WAIShowState.Pickups:
        if (!(cacher.cached instanceof Entity)) {
          break;
        }

        // Define some offsets for a tighter design
        zOffsetLight = 0.5;
        // Display the text with quick options
        quickTextParams(fovScaledParams, cacher, pedDistance, '~p~', []);

        break;
    }
  }

  // Mark closest entity to PlayerPed
  if (false && targetedEntity) {
    // prettier-ignore
    DrawSpotLightWithShadow(
      // Location, offset by zOffsetLight
      targetedEntity.cacher.original.Position.x,
      targetedEntity.cacher.original.Position.y,
      targetedEntity.cacher.original.Position.z + zOffsetLight,
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
