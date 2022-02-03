import React from 'react';
import { Account } from '../../../../../typings/accounts';
import { useActiveAccountValue } from '../hooks/accounts.state';
import { Item } from './AccountItem.styles';

interface AccountItemProps {
  account: Account;
  onClick: () => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ account, onClick }) => {
  const activeAccount = useActiveAccountValue();

  const isSelected = activeAccount?.id === account.id;

  return (
    <Item selected={isSelected} onClick={onClick}>
      <div>{account.accountName}</div>${account.balance}
    </Item>
  );
};

export default AccountItem;
