export interface ServerPromiseResp<T = undefined> {
  errorMsg?: string;
  status: 'ok' | 'error';
  data?: T;
}

export enum DIToken {
  Controller = 'server-controller',
}

export interface IController {
  name: string;
}
