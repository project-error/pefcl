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
  participants?: string[];
  owner: boolean;
  isDefault: boolean;
}

export enum AccountEvents {
  GetAccounts = 'pefcl:getAccounts',
  CreateAccount = 'pefcl:createAccount',
}
