import './commands.js';
import './gameType.js';
import { Chat, LoadModel } from './utils.js';

RegisterCommand(
  'car',
  async (_source: number, args: string[], _raw: string) => {
    let model = args[0] ?? 'adder';

    // check if the model actually exists
    const modelHashId = GetHashKey(model);

    const invalidModel = !IsModelInCdimage(modelHashId) || !IsModelAVehicle(modelHashId);

    if (invalidModel) {
      return Chat(
        `It might have been a good thing that you tried to spawn a ${model}. Who even wants their spawning to actually ^*succeed?`
      );
    }

    await LoadModel(modelHashId);

    const ped = PlayerPedId();
    const playerId = GetPlayerServerId(ped);
    const playerName = GetPlayerName(playerId);
    const [x, y, z] = GetEntityCoords(ped, true);
    const heading = GetEntityHeading(ped);
    const vehicle = CreateVehicle(modelHashId, x, y, z, heading, true, false);

    // Set the player into the drivers seat of the vehicle
    SetPedIntoVehicle(ped, vehicle, -1);

    // Allow the game engine to clean up the vehicle and model if needed
    SetEntityAsNoLongerNeeded(vehicle);
    SetModelAsNoLongerNeeded(model);

    // Tell the player the car spawned
    Chat(`Enjoy your new ${model}, ${playerName}`);
  },

  false
);
