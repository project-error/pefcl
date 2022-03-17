import { Account, AccountRole, AccountType } from '@typings/Account';

export const getIsAdmin = (account: Account) => {
  return [AccountRole.Admin, AccountRole.Owner].includes(account.role);
};

export const getIsShared = (account: Account) => {
  return account.type === AccountType.Shared;
};
