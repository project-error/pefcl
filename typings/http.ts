interface ServerResponseSuccess<T = object> {
  status: 'ok';
  data?: T;
}
interface ServerResponseError {
  status: 'error';
  errorMsg?: string;
  errorName?: string;
}

export type ServerPromiseResp<T = object> = ServerResponseSuccess<T> | ServerResponseError;

export interface Request<T = any> {
  data: T;
  source: number;
}

export type Response<T> = (returnData: ServerPromiseResp<T>) => void;
