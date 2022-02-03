import React from 'react';
import { useSetFilterAccounts } from '../hooks/accounts.state';
import { SearchIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { accountIcons } from '../../../icons/svgProvider';

/*
const StyledBase = styled(Paper)({
  marginBottom: 10,
  paddingBottom: 4,
  paddingTop: 4,
  background: '#42464A',
  display: 'flex',
  alignItems: 'center',
});
*/

const StyledBase = styled('div')({
  marginBottom: 10,
  paddingBottom: 4,
  paddingTop: 4,
  paddingRight: 10,
  background: '#42464A',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 7,
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
});

const InputBase = styled('input')({
  paddingLeft: 1,
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#fff',
  fontWeight: 500,
  fontSize: 15,
  textIndent: 5,
  '&::placeholder': {
    color: '#B5B5B5',
  },
});

const AccountSearchbar: React.FC = () => {
  const setFilteredAccounts = useSetFilterAccounts();
  const [t] = useTranslation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredAccounts(e.currentTarget.value);
  };

  return (
    <StyledBase>
      <InputBase
        onChange={handleSearchChange}
        placeholder={t('accounts.searchAccountsPlaceholder')}
      />
      {accountIcons.searchIcon}
    </StyledBase>
  );
};

export default AccountSearchbar;
