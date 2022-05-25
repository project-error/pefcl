export enum GenericErrors {
  NotFound = 'NotFound',
  UserNotFound = 'UserNotFound',
  MissingDefaultAccount = 'MissingDefaultAccount',
}

export enum ExternalAccountErrors {
  AccountIsYours = 'AccountIsYours',
}

export enum AccountErrors {
  AlreadyExists = 'AccountAlreadyExists',
  SameAccount = 'SameAccount',
}

export enum BalanceErrors {
  InsufficentFunds = 'InsufficentFunds',
}

export enum AuthorizationErrors {
  Forbidden = 'Forbidden',
}
