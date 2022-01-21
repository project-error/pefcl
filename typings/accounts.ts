export enum AccountType {
  Personal = 'personal',
  Shared = 'shared',
}

export type PreDBAccount = {
  accountName: string;
};

export interface Account {
  id: string;
  accountName: string;
  type: AccountType;
  balance: string;
  isDefault: boolean;
  participants?: string[];
  owner: boolean;
}

export enum AccountEvents {
  GetAccounts = 'pefcl:getAccounts',
  CreateAccount = 'pefcl:createAccount',
}
