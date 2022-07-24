import { ClientUtils } from '@project-error/pe-utils';

export const ClUtils = new ClientUtils({ promiseTimout: 200 });

/**
 *  Will Register an NUI event listener that will immediately
 *  proxy to a server side event of the same name and wait
 *  for the response.
 *  @param event - The event name to listen for
 */
export const RegisterNuiProxy = (event: string) => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, async (data: unknown, cb: CallableFunction) => {
    try {
      const res = await ClUtils.emitNetPromise(event, data);
      cb(res);
    } catch (e) {
      console.error('Error encountered while listening to resp. Error:', e);
      cb({ status: 'error' });
    }
  });
};

type Vector = {
  x: number;
  y: number;
  z: number;
};

const getVector = (coords: number[]) => {
  const [x, y, z] = coords;
  return {
    x,
    y,
    z,
  };
};

const getDistance = (v1: Vector, v2: Vector) => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

type GetNearestPlayerResult = {
  source: number;
  distance: number;
};

export const getNearestPlayer = (maxDistance?: number): GetNearestPlayerResult | null => {
  const playerId = PlayerId();
  const playerPed = PlayerPedId();
  const playerCoords = GetEntityCoords(playerPed, false);
  const otherPlayersIds: number[] = GetActivePlayers();
  const playerPosition = getVector(playerCoords);

  let closestPlayer: number | undefined;
  let distance: number | undefined;

  otherPlayersIds.forEach((otherPlayerId) => {
    if (otherPlayerId === playerId || !playerCoords) {
      return;
    }

    const otherPlayerPedId = GetPlayerPed(otherPlayerId);
    const otherPlayerCoords = GetEntityCoords(otherPlayerPedId, false);

    if (!otherPlayerCoords) {
      return;
    }
    const otherPlayerPosition = getVector(otherPlayerCoords);
    const currentDistance = getDistance(otherPlayerPosition, playerPosition);

    if (!distance || currentDistance < distance) {
      distance = currentDistance;
      closestPlayer = GetPlayerServerId(otherPlayerId);
    }
  });

  if (!closestPlayer) {
    return null;
  }

  if (maxDistance && maxDistance < (distance ?? 0)) {
    throw new Error('No player nearby');
  }

  return {
    distance: distance ?? Infinity,
    source: closestPlayer,
  };
};

export const validateAmount = (rawAmount: string | number) => {
  if (!rawAmount || isNaN(Number(rawAmount))) {
    return false;
  }

  const amount = Number(rawAmount);
  if (amount <= 0) {
    return false;
  }

  return true;
};
