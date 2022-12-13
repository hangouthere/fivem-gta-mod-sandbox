import { Me, playerNameMap, ValidatePlayer } from './PlayerMap.js';
import { Alert, Chat, GetCoords, GetPedOrVehId, LoadModel } from './Utils.js';

RegisterCommand(
  'killme',
  async (_source: number, args: string[], _raw: string) => {
    SetEntityHealth(Me().ped, 0);
  },
  false
);

RegisterCommand(
  'wantme',
  async (_source: number, args: string[], _raw: string) => {
    const me = Me();
    SetPlayerWantedLevel(me.id, 4, false);
    SetPlayerWantedLevelNow(me.id, false);
  },
  false
);

RegisterCommand(
  'getpos',
  async (_source: number, args: string[], _raw: string) => {
    const me = Me();
    const pedLocation = GetEntityCoords(me.ped, true);
    const pedRotation = GetEntityRotation(me.ped, 2);
    Chat(`Current Location: ${pedLocation}`);
    Chat(`Current Rotation: ${pedRotation}`);
  },
  false
);

RegisterCommand(
  'setrot',
  async (_source: number, args: string[], _raw: string) => {
    const me = Me();
    const [z, x, y] = GetEntityRotation(me.ped, 2);
    const newY = parseInt(args[0] ?? y);

    SetEntityHeading(me.ped, newY);
    SetEntityRotation(me.ped, z, x, y, 2, false);
  },
  false
);

RegisterCommand(
  'listplayers',
  async (_source: number, args: string[], _raw: string) => {
    Chat('Players Online:');
    Object.keys(playerNameMap).forEach(name => {
      Chat('   ' + name);
    });
  },
  false
);

RegisterCommand(
  'tptome',
  async (_source: number, args: string[], _raw: string) => {
    const targetPlayerName = args[0];
    const targetPlayer = ValidatePlayer(targetPlayerName);

    if (!targetPlayer) {
      return;
    }

    const me = Me();
    const { x, y, z } = GetCoords(me.ped);
    const targetPedId = GetPedOrVehId(targetPlayer.ped);

    Alert(`Teleporting ${targetPlayer.name}(${targetPlayer.ped}) to ${me.name}(${me.ped})!`);

    SetEntityCoords(targetPedId, x, y, z, false, false, false, false);
  },
  false
);

RegisterCommand(
  'tpmeto',
  async (_source: number, args: string[], _raw: string) => {
    const targetPlayerName = args[0];
    const targetPlayer = ValidatePlayer(targetPlayerName);

    if (!targetPlayer) {
      return;
    }

    const me = Me();
    const targetPedId = GetPedOrVehId(targetPlayer.ped);
    const [x, y, z] = GetEntityCoords(targetPedId, true);

    Alert(`Teleporting ${me.name}(${me.ped}) to ${targetPlayer.name}(${targetPlayer.ped})!`);

    SetEntityCoords(me.ped, x, y, z, false, false, false, false);
  },
  false
);

RegisterCommand(
  'car',
  async (_source: number, args: string[], _raw: string) => {
    const model = args[0] ?? 'adder';
    // check if the model actually exists
    const modelHashId = GetHashKey(model);
    const invalidModel = !IsModelInCdimage(modelHashId) || !IsModelAVehicle(modelHashId);

    if (invalidModel) {
      return Chat(`'${model}' is not a valid model`);
    }

    await LoadModel(modelHashId);

    const me = Me();
    const { x, y, z, heading } = GetCoords(me.ped);
    const vehicle = CreateVehicle(modelHashId, x, y, z, heading.y, true, false);

    // Set the player into the drivers seat of the vehicle
    SetPedIntoVehicle(me.ped, vehicle, -1);
    // Allow the game engine to clean up the vehicle and model if needed
    SetEntityAsNoLongerNeeded(vehicle);
    SetModelAsNoLongerNeeded(model);

    // Tell the player the car spawned
    Chat(`Enjoy your new ${model}, ${me.name}`);
  },

  false
);
