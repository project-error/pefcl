import EventEmitter from 'events';
import { readFileSync } from 'fs';
import path from 'path';

const isMocking = process.env.NODE_ENV === 'mocking' || process.env.NODE_ENV === 'test';
export const mockedResourceName = 'pefcl';

// TODO: Move this into package
const convars = {
  mysql_connection_string: 'mysql://root:bruv@localhost/dev',
};

const players: any = {
  '2': {
    name: 'BingoBerra',
    license: 'license:1',
  },
  '3': {
    name: 'OtherGuy',
    license: 'license:2',
  },
};

if (isMocking) {
  const baseDir = path.resolve(__dirname + '/../../');
  const ServerEmitter = new EventEmitter().setMaxListeners(25);
  const NetEmitter = new EventEmitter().setMaxListeners(25);

  global.LoadResourceFile = (_resourceName: string, fileName: string) => {
    const file = readFileSync(`${baseDir}/${fileName}`, 'utf-8');
    return file;
  };

  global.GetResourceState = () => {
    return 'Mocked';
  };

  global.GetCurrentResourceName = () => {
    return mockedResourceName;
  };

  global.GetPlayerName = (source: keyof typeof players) => {
    return players[source].name;
  };

  global.getPlayerIdentifiers = (source: keyof typeof players) => {
    return [players[source].license];
  };

  global.getPlayers = () => {
    return Object.keys(players);
  };

  global.GetResourcePath = () => {
    const path = '/';
    return path;
  };

  global.GetConvar = (convar: keyof typeof convars, fallback: string) => {
    return convars[convar] ?? fallback;
  };

  global.exports = () => ({
    'your-resource': {
      addCash: () => {
        console.log('global.server.ts: Adding cash ..');
        throw new Error('no funds');
      },
      getCash: () => {
        console.log('global.server.ts: Getting cash ..');
        return 2500;
      },
      removeCash: () => {
        console.log('global.server.ts: Removing cash ..');
        throw new Error('no funds');
      },
    },
  });

  global.on = (event: string, listeners: (...args: any[]) => void) => {
    ServerEmitter.on(event, listeners);
  };

  global.onNet = (event: string, listeners: (...args: any[]) => void) => {
    NetEmitter.on(event, listeners);
  };

  global.emit = (event: string, listeners: (...args: any[]) => void) => {
    ServerEmitter.emit(event, listeners);
  };

  global.emitNet = (event: string, ...args: any[]) => {
    NetEmitter.emit(event, ...args);
  };

  global.StopResource = (resource: string) => {
    console.log('global.server.ts: Stopping resource ..' + resource);
    process.exit(0);
  };
}
