export enum GeneralEvents {
  CloseUI = 'pefcl:closeNui',
  ResourceStarted = 'pefcl:resourceStarted',
  ResourceStopped = 'pefcl:resourceStopped',
}

export enum UserEvents {
  GetUsers = 'pefcl:userEventsGetUsers',
  Loaded = 'pefcl:userLoaded',
  Unloaded = 'pefcl:userUnloaded',
  LoadClient = 'pefcl:loadClient',
}

export enum NUIEvents {
  Loaded = 'pefcl:nuiHasLoaded',
  Unloaded = 'pefcl:nuiHasUnloaded',
  SetCardId = 'pefcl:nuiSetCardId',
  SetCards = 'pefcl:nuiSetCards',
}

export enum AccountEvents {
  GetAtmAccount = 'pefcl:getAtmAccount',
  GetAccounts = 'pefcl:getAccounts',
  CreateAccount = 'pefcl:createAccount',
  RenameAccount = 'pefcl:renameAccount',
  CreateAccountResponse = 'pefcl:createAccountResponse',
  SetDefaultAccount = 'pefcl:setDefaultAccount',
  ChangedDefaultAccount = 'pefcl:changedDefaultAccount',
  DeleteAccount = 'pefcl:deleteAccount',
  DepositMoney = 'pefcl:depositMoney',
  WithdrawMoney = 'pefcl:withdrawMoney',
  NewBalance = 'pefcl:newAccountBalance',
  NewAccountCreated = 'pefcl:newAccountCreated',
  AccountDeleted = 'pefcl:accountDeleted',
}

export enum SharedAccountEvents {
  GetUsers = 'pefcl:sharedAccountsGetUsers',
  AddUser = 'pefcl:sharedAccountsAddUser',
  RemoveUser = 'pefcl:sharedAccountsRemoveUser',
}

export enum ExternalAccountEvents {
  Add = 'pefcl:addExternalAccount',
  Get = 'pefcl:getExternalAccount',
}

export enum Broadcasts {
  UpdatedAccount = 'pefcl:updatedAccountBroadcast',
  NewTransaction = 'pefcl:newTransactionBroadcast',
  NewInvoice = 'pefcl:newInvoiceBroadcast',
  NewSharedUser = 'pefcl:newSharedUser',
  RemovedSharedUser = 'pefcl:removedSharedUser',
  NewAccount = 'pefcl:newAccountBroadcast',
  NewAccountBalance = 'pefcl:newAccountBalanceBroadcast',
  NewDefaultAccountBalance = 'pefcl:newDefaultAccountBalance',
  NewCashAmount = 'pefcl:newCashAmount',
  NewCard = 'pefcl:newCardBroadcast',
}

export enum TransactionEvents {
  Get = 'pefcl:getTransactions',
  GetHistory = 'pefcl:getTransactionsHistory',
  CreateTransfer = 'pefcl:createTransfer',
  NewTransaction = 'pefcl:newTransaction',
}

export enum InvoiceEvents {
  Get = 'pefcl:getInvoices',
  CountUnpaid = 'pefcl:countUnpaid',
  CreateInvoice = 'pefcl:createInvoice',
  CreateOnlineInvoice = 'pefcl:createOnlineInvoice',
  PayInvoice = 'pefcl:payInvoice',
}

export enum CashEvents {
  GetMyCash = 'pefcl:getMyCash',
  Give = 'pefcl:giveCash',
  NewCash = 'pefcl:newCash',
}

export enum BalanceEvents {
  UpdateCashBalance = 'pefcl:updateCashBalance',
}

export enum CardEvents {
  Get = 'pefcl:getCards',
  OrderShared = 'pefcl:orderSharedCard',
  OrderPersonal = 'pefcl:orderPersonalCard',
  Block = 'pefcl:blockCard',
  Delete = 'pefcl:deleteCard',
  UpdatePin = 'pefcl:updatePin',
  NewCard = 'pefcl:newCard',
  GetInventoryCards = 'pefcl:getInventoryCards',
}
