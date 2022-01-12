import React, { memo } from 'react';
import { List, ListItem, ListItemText, ListSubheader } from '@mui/material';
import { Account, AccountType } from '../../../../typings/accounts';
import AccountItem from './components/AccountItem';

interface AccountListProps {
  accounts: Account[];
  handleChangeAccount: (id: string) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, handleChangeAccount }) => {
  return (
    <>
      <List
        disablePadding
        subheader={<ListSubheader sx={{ borderRadius: 1 }}>Personal</ListSubheader>}
      >
        {accounts
          .filter((a) => a.type === AccountType.Personal)
          .map((account) => (
            <AccountItem account={account} onClick={() => handleChangeAccount(account.id)} />
          ))}
      </List>
      <List
        disablePadding
        subheader={<ListSubheader sx={{ borderRadius: 1 }}>Shared</ListSubheader>}
      >
        {accounts
          .filter((a) => a.type === AccountType.Shared)
          .map((account) => (
            <AccountItem account={account} onClick={() => handleChangeAccount(account.id)} />
          ))}
      </List>
    </>
  );
};

export default memo(AccountList);
