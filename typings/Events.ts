export enum GeneralEvents {
  CloseBank = 'pefcl:closeNui',
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
  CreateTransfer = 'pefcl:createTransfer',
}

export enum InvoiceEvents {
  Get = 'pefcl:getInvoices',
  CreateInvoice = 'pefcl:createInvoice',
  PayInvoice = 'pefcl:payInvoice',
}
