import { Game, Maths, Model, Vehicle, VehicleHash, VehicleSeat, World } from '@nativewrappers/client';
import { ChatSelf } from '../../utils/Messaging.js';

const command = async (_source: number, args: string[], _raw: string) => {
  const modelName = args[0];
  const ped = Game.PlayerPed;
  const spawnLoc = ped.Position;
  const heading = ped.Heading;

  let newCar: Vehicle | null;

  if (modelName) {
    newCar = await World.createVehicle(new Model(modelName), spawnLoc, heading);
  } else {
    const vehicleCount: number = Object.keys(VehicleHash).length / 2; // check
    const randomIndex: number = Maths.getRandomInt(0, vehicleCount);
    const modelHash = Object.keys(VehicleHash)[randomIndex];

    newCar = await World.createVehicle(new Model(+modelHash), spawnLoc, heading);
  }

  if (!newCar) {
    return ChatSelf(`'${modelName}' is not a valid model`);
  }

  ped.setIntoVehicle(newCar, VehicleSeat.Driver);

  // Allow the game engine to clean up the vehicle and model if needed
  newCar.IsMissionEntity = false;

  ChatSelf(`Enjoy your new ${newCar.DisplayName}, ${Game.Player.Name}`);
};

RegisterCommand('givecar', command, false);
emit('chat:addSuggestions', [
  {
    name: '/givecar',
    help: 'Give yourself a car!',
    params: [
      {
        name: 'Car Model Name',
        help: 'Which Car Model Name to spawn. Look up the official names online. If no Car Model Name is supplied, a random one will be chosen for you.'
      }
    ]
  }
]);
