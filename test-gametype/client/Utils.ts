export type PlayerInfo = {
  id: number;
  serverId: number;
  name: string;
  ped: number;
};

export type PlayerIdMap = Record<number, PlayerInfo>;
export type PlayerPedMap = Record<number, PlayerInfo>;
export type PlayerNameMap = Record<string, PlayerInfo>;

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Coords = Vector3 & {
  heading: Vector3;
};

export type SpawnCoords = Vector3 & {
  heading: number;
};

export const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const ArrayRandom = <T>(list: Array<T>) => list[Math.floor(Math.random() * list.length)];

export const LoadModel = async (hashId: number) => {
  // Request the model and wait until the game has loaded it
  RequestModel(hashId);

  while (!HasModelLoaded(hashId)) {
    await Delay(100);
  }
};

export const Chat = (msg: string | string[]) => {
  console.log(msg);

  emit('chat:addMessage', {
    args: Array.isArray(msg) ? msg : [msg]
  });
};

export const Alert = (msg: string) => {
  console.info(msg);
  SetTextComponentFormat('STRING');
  AddTextComponentString(msg);
  DisplayHelpTextFromStringLabel(0, false, true, -1);
};

export const Notify = (msg: string) => {
  console.info(msg);
  SetNotificationTextEntry('STRING');
  AddTextComponentString(msg);
  DrawNotification(true, false);
};

export const GetPedOrVehId = (pedId: number) => {
  const isInVehicle = IsPedInAnyVehicle(pedId, false);

  return isInVehicle ? GetVehiclePedIsUsing(pedId) : pedId;
};

export const GetCoords = (pedId: number) => {
  const [x, y, z] = GetEntityCoords(pedId, true);
  const [hZ, hX, hY] = GetEntityRotation(pedId, 2);

  return { x, y, z, heading: { x: hX, y: hY, z: hZ } } as Coords;
};
