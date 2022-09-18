export enum GeneralEvents {
  CloseUI = 'pefcl:closeNui',
  ResourceStarted = 'pefcl:resourceStarted',
  ResourceStopped = 'pefcl:resourceStopped',
}

export enum UserEvents {
  GetUsers = 'pefcl:userEventsGetUsers',
  Loaded = 'pefcl:userLoaded',
  Unloaded = 'pefcl:userUnloaded',
}

export enum NUIEvents {
  Loaded = 'pefcl:nuiHasLoaded',
  Unloaded = 'pefcl:nuiHasUnloaded',
}

export enum AccountEvents {
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
