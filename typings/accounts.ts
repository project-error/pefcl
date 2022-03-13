export enum AccountType {
  Personal = 'personal',
  Shared = 'shared',
}

export type PreDBAccount = {
  fromAccountId: number;
  accountName: string;
  isDefault?: boolean;
  isShared?: boolean;
};

export interface Account {
  id: number;
  balance: number;
  identifier: string;
  isDefault: boolean;
  accountName: string;
  ownerIdentifier: string;
  type: AccountType;
}

export type TransactionAccount = Pick<Account, 'id' | 'accountName'>;

export interface ATMInput {
  amount: number;
  message: string;
  accountId?: number;
}

export enum AccountEvents {
  GetAccounts = 'pefcl:getAccounts',
  CreateAccount = 'pefcl:createAccount',
  CreateAccountResponse = 'pefcl:createAccountResponse',
  SetDefaultAccount = 'pefcl:setDefaultAccount',
  DeleteAccount = 'pefcl:deleteAccount',
  DepositMoney = 'pefcl:depositMoney',
  WithdrawMoney = 'pefcl:withdrawMoney',
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
