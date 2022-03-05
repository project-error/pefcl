export enum AccountType {
  Personal = 'personal',
  Shared = 'shared',
}

export type PreDBAccount = {
  accountName: string;
};

export interface Account {
  id: number;
  balance: number;
  owner: string;
  isOwner: boolean;
  isDefault: boolean;
  accountName: string;
  type: AccountType;
}

export type TransactionAccount = Pick<Account, 'id' | 'accountName'>;

export interface DepositDTO {
  tgtAccount: Account;
  amount: number;
  message: string;
}

export enum AccountEvents {
  GetAccounts = 'pefcl:getAccounts',
  CreateAccount = 'pefcl:createAccount',
  DeleteAccount = 'pefcl:deleteAccount',
  DepositMoney = 'pefcl:depositMoney',
}

export enum TransactionEvents {
  Get = 'pefcl:getTransactions',
}

export enum InvoiceEvents {
  Get = 'pefcl:getInvoices',
}
