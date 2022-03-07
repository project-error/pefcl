export enum AccountType {
  Personal = 'personal',
  Shared = 'shared',
}

export type PreDBAccount = {
  accountName: string;
  isDefault?: boolean;
  type?: AccountType;
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

export interface DepositDTO {
  amount: number;
  message: string;
  accountId: number;
}

export enum AccountEvents {
  GetAccounts = 'pefcl:getAccounts',
  CreateAccount = 'pefcl:createAccount',
  CreateAccountResponse = 'pefcl:createAccountResponse',
  SetDefaultAccount = 'pefcl:setDefaultAccount',
  DeleteAccount = 'pefcl:deleteAccount',
  DepositMoney = 'pefcl:depositMoney',
}

export enum TransactionEvents {
  Get = 'pefcl:getTransactions',
}

export enum InvoiceEvents {
  Get = 'pefcl:getInvoices',
}
