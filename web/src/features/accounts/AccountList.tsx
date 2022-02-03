import React, { memo } from 'react';
import { List, ListSubheader } from '@mui/material';
import { Account, AccountType } from '../../../../typings/accounts';
import AccountItem from './components/AccountItem';
import { useTranslation } from 'react-i18next';

interface AccountListProps {
  accounts: Account[];
  handleChangeAccount: (account: Account) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, handleChangeAccount }) => {
  const [t] = useTranslation();

  const hasSharedAccounts = accounts.some((acc) => acc.type === AccountType.Shared);

  if (!accounts) return <h1>Loading...</h1>;

  return (
    <>
      <div>
        {accounts &&
          accounts
            .filter((acc) => acc.type === AccountType.Personal)
            .map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                onClick={() => handleChangeAccount(account)}
              />
            ))}
      </div>
      {/*
      <List
        disablePadding
        subheader={
          <ListSubheader sx={{ borderRadius: 1 }}>{t('accounts.list.shared')}</ListSubheader>
        }
      >
        {hasSharedAccounts &&
          accounts
            .filter((acc) => acc.type === AccountType.Shared)
            .map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                onClick={() => handleChangeAccount(account)}
              />
            ))}
      </List>
*/}
    </>
  );
};

export default memo(AccountList);
