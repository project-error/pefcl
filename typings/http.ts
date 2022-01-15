export interface ServerPromiseResp<T = undefined> {
  errorMsg?: string;
  status: 'ok' | 'error';
  data?: T;
}

export interface Request<T = any> {
  data: T;
  source: number;
}

export type Response<T> = (returnData: ServerPromiseResp<T>) => void;
