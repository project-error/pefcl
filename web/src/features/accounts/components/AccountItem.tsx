import React from 'react';
import { ListItem, ListItemText } from '@mui/material';
import { Account } from '../../../../../typings/accounts';

interface AccountItemProps {
  account: Account;
  onClick: () => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ account, onClick }) => (
  <ListItem divider button onClick={onClick}>
    <ListItemText
      primaryTypographyProps={{
        color: 'text.primary',
      }}
      primary={account.accountName}
      secondary={account.balance}
    />
  </ListItem>
);

export default AccountItem;
