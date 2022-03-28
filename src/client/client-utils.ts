import { uuidV4 } from '@project-error/pe-utils';
import { ClUtils } from './client';

interface ISettings {
  promiseTimeout: number;
}

interface ISettingsParams {
  promiseTimeout?: number;
}

export default class ClientUtils {
  private _settings: ISettings;
  private _defaultSettings: ISettings = {
    promiseTimeout: 15000,
  };

  constructor(settings?: ISettingsParams) {
    settings && this.setSettings(settings);
  }

  public setSettings(settings: ISettingsParams) {
    this._settings = {
      ...this._defaultSettings,
      ...settings,
    };
  }

  public emitNetPromise<T = any>(eventName: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedOut = false;

      setTimeout(() => {
        hasTimedOut = true;
        reject(`${eventName} has timed out after ${this._settings.promiseTimeout} ms`);
      }, this._settings.promiseTimeout);

      // Have to use this as the regular uuid refused to work here for some
      // fun reason
      const uniqId = uuidV4();

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, listenEventName, ...args);

      const handleListenEvent = (data: T) => {
        removeEventListener(listenEventName, handleListenEvent);
        if (hasTimedOut) return;
        resolve(data);
      };
      onNet(listenEventName, handleListenEvent);
    });
  }
}

type CallbackFn<T> = (data: T, cb: CallableFunction) => void;

/**
 * A wrapper for handling NUI Callbacks
 *  @param event - The event name to listen for
 *  @param callback - The callback function
 */
export const RegisterNuiCB = <T = any>(event: string, callback: CallbackFn<T>) => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, callback);
};

/**
 * Returns a promise that will be resolved once the client has been loaded.
 */
export const playerLoaded = () => {
  return new Promise<any>((resolve) => {
    const id = setInterval(() => {
      if (global.isPlayerLoaded) resolve(id);
    }, 50);
  }).then((id) => clearInterval(id));
};

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
      console.log('sending response:', res);
      cb(res);
    } catch (e) {
      console.error('Error encountered while listening to resp. Error:', e);
      cb({ status: 'error' });
    }
  });
};

type MsgpackTypes =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'function'
  | 'object';

type WrapperNetEventCb = <T extends any[]>(...args: T) => void;

/**
 * Wrapped onNet so we can use generic types on return values from server
 * @param event - The event name to listen to
 * @param cb - The callback function to execute
 */
export const onNpwdEvent = (event: string, cb: WrapperNetEventCb) => {
  onNet(event, cb);
};
export const verifyExportArgType = (
  exportName: string,
  passedArg: unknown,
  validTypes: MsgpackTypes[],
): void => {
  const passedArgType = typeof passedArg;

  if (!validTypes.includes(passedArgType))
    throw new Error(
      `Export ${exportName} was called with incorrect argument type (${validTypes.join(
        ', ',
      )}. Passed: ${passedArg}, Type: ${passedArgType})`,
    );
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
  console.log('Looking for a player nearby.. ');

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
