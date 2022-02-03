import React from 'react';
import { Account } from '../../../../../typings/accounts';
import { useActiveAccountValue } from '../hooks/accounts.state';
import { Item } from './AccountItem.styles';
import styled from '@emotion/styled';

interface AccountItemProps {
  account: Account;
  onClick: () => void;
}

const PrimaryText = styled('p')({
  fontWeight: 500,
  margin: 0,
  color: '#fff',
});

const SecondaryText = styled('p')({
  fontWeight: 'normal',
  margin: 0,
  marginTop: 5,
  color: '#B5B5B5',
});

const AccountItem: React.FC<AccountItemProps> = ({ account, onClick }) => {
  const activeAccount = useActiveAccountValue();

  const isSelected = activeAccount?.id === account.id;

  return (
    <Item selected={isSelected} onClick={onClick}>
      <PrimaryText>{account.accountName}</PrimaryText>
      <SecondaryText>${account.balance}</SecondaryText>
    </Item>
  );
};

export default AccountItem;
