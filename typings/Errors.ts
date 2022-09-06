export enum GenericErrors {
  BadInput = 'BadInput',
  NotFound = 'NotFound',
  UserNotFound = 'UserNotFound',
  MissingDefaultAccount = 'MissingDefaultAccount',
}

export enum ExternalAccountErrors {
  AccountIsYours = 'AccountIsYours',
}

export enum AccountErrors {
  NotFound = 'AccountNotFound',
  AlreadyExists = 'AccountAlreadyExists',
  UserAlreadyExists = 'UserAlreadyExists',
  SameAccount = 'SameAccount',
}

export enum UserErrors {
  NotFound = 'UserNotFound',
}

export enum BalanceErrors {
  InsufficentFunds = 'InsufficentFunds',
}

export enum AuthorizationErrors {
  Forbidden = 'Forbidden',
}
