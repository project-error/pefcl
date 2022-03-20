export enum AccountType {
  Personal = 'personal',
  Shared = 'shared',
}

export enum AccountRole {
  Owner = 'owner',
  Admin = 'admin',
  Contributor = 'contributor',
}

export type PreDBAccount = {
  fromAccountId: number;
  accountName: string;
  isDefault?: boolean;
  isShared?: boolean;
};

export type RenameAccountInput = {
  accountId: number;
  name: string;
};

export interface Account {
  id?: number;
  number: string;
  balance: number;
  isDefault: boolean;
  accountName: string;
  ownerIdentifier: string;
  role: AccountRole;
  type: AccountType;
}

export interface CreateAccountInput {
  isDefault: boolean;
  accountName: string;
  ownerIdentifier: string;
  type: AccountType;
}

export interface SharedAccount {
  id?: number;
  user: string;
  role: AccountRole;
  name?: string;
  account?: Account;
  accountId?: number;
  setAccount?(): void;
}
export type SharedAccountUser = Pick<SharedAccount, 'user' | 'role' | 'name'>;
export interface SharedAccountInput {
  user: string;
  name?: string;
  accountId: number;
  role?: AccountRole;
}
export interface AddToSharedAccountInput {
  name: string;
  identifier: string;
  accountId: number;
  role?: AccountRole;
}

export interface RemoveFromSharedAccountInput {
  accountId: number;
  identifier: string;
}

export type TransactionAccount = Pick<Account, 'id' | 'accountName'>;

export interface ATMInput {
  amount: number;
  message: string;
  accountId?: number;
}

export interface ExternalAccount {
  id?: number;
  name: string;
  number: string;
  userId?: string;
}

export interface ExternalAccountInput {
  name: string;
  number: string;
  userId: string;
}
