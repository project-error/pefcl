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

export type CreateBasicAccountInput = {
  name: string;
  type: AccountType;
  identifier: string;
  number?: string;
};

export type RenameAccountInput = {
  accountId: number;
  name: string;
};

export interface Account {
  id: number;
  number: string;
  balance: number;
  isDefault: boolean;
  accountName: string;
  ownerIdentifier: string;
  role: AccountRole;
  type: AccountType;
  createdAt?: string;
}

export interface CreateAccountInput {
  accountName: string;
  ownerIdentifier: string;
  type: AccountType;
  isDefault?: boolean;
  number?: string;
  balance?: number;
}

export interface SharedAccount {
  id: number;
  userIdentifier: string;
  role: AccountRole;
  name?: string;
  account?: Account;
  accountId?: number;
  setAccount?(): void;
}
export type SharedAccountUser = Pick<SharedAccount, 'userIdentifier' | 'role' | 'name'>;
export interface SharedAccountInput {
  userIdentifier: string;
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

export interface AddToUniqueAccountInput {
  role?: AccountRole;
  source?: number;
  userIdentifier?: string;
  accountIdentifier: string;
}

export interface RemoveFromUniqueAccountInput {
  source?: number;
  userIdentifier?: string;
  accountIdentifier: string;
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
  id: number;
  name: string;
  number: string;
  userId?: string;
}

export interface ExternalAccountInput {
  name: string;
  number: string;
  userId: string;
}

export interface UpdateBankBalanceInput {
  amount: number;
  message: string;
  identifier?: string;
}

export interface UpdateBankBalanceByNumberInput {
  amount: number;
  message: string;
  accountNumber: string;
}
