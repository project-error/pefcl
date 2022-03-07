import EventEmitter from 'events';
import { readFileSync } from 'fs';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseDir = path.resolve(__dirname + '/../../');

const convars = {
  mysql_connection_string: 'mysql://root:bruv@localhost/dev',
};

const players = {
  '2': {
    name: 'BingoBerra',
    license: 'license:1',
  },
};

if (isDevelopment) {
  const ServerEmitter = new EventEmitter();
  const NetEmitter = new EventEmitter();

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

  global.GetResourcePath = () => {
    const path = '/';
    console.log('GetResourcePath:', path);
    return path;
  };

  global.GetConvar = (convar: keyof typeof convars, fallback: string) => {
    return convars[convar] ?? fallback;
  };

  global.exports = {
    'my-resource': {
      pefclDepositMoney: () => {
        console.log('deposited money');
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
