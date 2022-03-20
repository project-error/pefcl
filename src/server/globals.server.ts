import EventEmitter from 'events';
import { readFileSync } from 'fs';
import path from 'path';

const isMocking = process.env.NODE_ENV === 'mocking' || process.env.NODE_ENV === 'test';

const convars = {
  mysql_connection_string: 'mysql://root:bruv@localhost/dev',
};

const players = {
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

  global.GetCurrentResourceName = () => {
    return 'pe-financial';
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

  global.exports = {
    'my-resource': {
      pefclDepositMoney: () => {
        console.log('global.server.ts: Depositing money ..');
        throw new Error('no funds');
      },
      getCurrentBalance: () => {
        console.log('global.server.ts: Getting balance ..');
        return 2500;
      },
    },
  };

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
}
