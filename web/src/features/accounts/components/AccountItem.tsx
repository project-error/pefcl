import React from 'react';
import { Account } from '../../../../../typings/accounts';
import { useActiveAccountValue } from '../hooks/accounts.state';
import { Item } from './AccountItem.styles';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { activeAccountAtom, activeAccountAtomId } from '../../../data/accounts';

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
  fontSize: 14,
});

const AccountItem: React.FC<AccountItemProps> = ({ account, onClick }) => {
  const [activeId] = useAtom(activeAccountAtomId);
  const isSelected = activeId === account.id;

  return (
    <Item selected={isSelected} onClick={onClick}>
      <PrimaryText>{account.accountName}</PrimaryText>
      <SecondaryText>${account.balance}</SecondaryText>
    </Item>
  );
};

export default AccountItem;
