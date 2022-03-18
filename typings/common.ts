export enum DIToken {
  Controller = 'server-controller',
}

export const TYPES = {
  transactionModel: Symbol('transactionModel'),
};

export interface IController {
  name: string;
}
