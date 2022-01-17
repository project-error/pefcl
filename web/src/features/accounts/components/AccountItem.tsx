import React from 'react';
import { ListItemText, ListItemButton } from '@mui/material';
import { Account } from '../../../../../typings/accounts';

interface AccountItemProps {
  account: Account;
  onClick: () => void;
  selected?: boolean;
}

const AccountItem: React.FC<AccountItemProps> = ({ selected, account, onClick }) => (
  <ListItemButton divider onClick={onClick}>
    <ListItemText
      primaryTypographyProps={{
        color: 'text.primary',
      }}
      primary={account.accountName}
      secondary={account.balance}
    />
  </ListItemButton>
);

export default AccountItem;
