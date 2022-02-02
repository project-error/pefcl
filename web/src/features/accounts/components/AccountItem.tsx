import React from 'react';
import { ListItemText, ListItemButton, ListItem } from '@mui/material';
import { Account } from '../../../../../typings/accounts';
import { useActiveAccountValue } from '../hooks/accounts.state';

interface AccountItemProps {
  account: Account;
  onClick: () => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ account, onClick }) => {
  const activeAccount = useActiveAccountValue();

  const isSelected = activeAccount?.id === account.id;

  return (
    <ListItem button divider selected={isSelected} onClick={onClick}>
      <ListItemText
        primaryTypographyProps={{
          color: 'text.primary',
        }}
        primary={account.accountName}
        secondary={`$${account.balance}`}
      />
    </ListItem>
  );
};

export default AccountItem;
