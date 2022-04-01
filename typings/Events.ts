export enum GeneralEvents {
  CloseUI = 'pefcl:closeNui',
  ResourceStarted = 'pefcl:resourceStarted',
}

export enum UserEvents {
  GetUsers = 'pefcl:userEventsGetUsers',
}

export enum AccountEvents {
  GetAccounts = 'pefcl:getAccounts',
  CreateAccount = 'pefcl:createAccount',
  RenameAccount = 'pefcl:renameAccount',
  CreateAccountResponse = 'pefcl:createAccountResponse',
  SetDefaultAccount = 'pefcl:setDefaultAccount',
  DeleteAccount = 'pefcl:deleteAccount',
  DepositMoney = 'pefcl:depositMoney',
  WithdrawMoney = 'pefcl:withdrawMoney',
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

export enum TransactionEvents {
  Get = 'pefcl:getTransactions',
  GetHistory = 'pefcl:getTransactionsHistory',
  CreateTransfer = 'pefcl:createTransfer',
  NewTransactionBroadcast = 'pefcl:newTransactionBroadcast',
}

export enum InvoiceEvents {
  Get = 'pefcl:getInvoices',
  CreateInvoice = 'pefcl:createInvoice',
  CreateOnlineInvoice = 'pefcl:createOnlineInvoice',
  PayInvoice = 'pefcl:payInvoice',
}

export enum CashEvents {
  GetMyCash = 'pefcl:getMyCash',
  Give = 'pefcl:giveCash',
}

export enum BalanceEvents {
  UpdateCashBalance = 'pefcl:updateCashBalance',
}
