import { Account, AccountRole, AccountType } from '@typings/Account';

export const getIsAdmin = (account: Account) => {
  return [AccountRole.Admin, AccountRole.Owner].includes(account.role);
};

export const getIsOwner = (account: Account) => {
  return [AccountRole.Owner].includes(account.role);
};

export const getIsShared = (account: Account) => {
  return account.type === AccountType.Shared;
};

export const updateAccount = (accounts: Account[], updatedAccount: Account): Account[] => {
  const existingAccount = accounts.find((acc) => acc.id === updatedAccount.id);
  if (!existingAccount) {
    return accounts;
  }

  const newAccounts = [...accounts];
  const index = accounts.findIndex((acc) => acc.id === existingAccount.id);
  newAccounts.splice(index, 1, updatedAccount);

  return newAccounts;
};
