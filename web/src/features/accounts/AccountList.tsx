import React from 'react';
import { CircularProgress, List, ListSubheader } from '@mui/material';
import { Account, AccountType } from '../../../../typings/accounts';
import AccountItem from './components/AccountItem';
import { useActiveAccountValue } from './hooks/accounts.state';

interface AccountListProps {
  accounts: Account[];
  handleChangeAccount: (account: Account) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, handleChangeAccount }) => {
  if (!accounts) return <h1>Loading...</h1>;

  return (
    <>
      <List
        disablePadding
        subheader={<ListSubheader sx={{ borderRadius: 1 }}>Personal</ListSubheader>}
      >
        {accounts &&
          accounts.map((account) => (
            <AccountItem account={account} onClick={() => handleChangeAccount(account)} />
          ))}
      </List>
    </>
  );
};

export default AccountList;
