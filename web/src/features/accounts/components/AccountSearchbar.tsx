import React from 'react';
import { useSetFilterAccounts } from '../hooks/accounts.state';
import { useTranslation } from 'react-i18next';
import { AccountIcons } from '../../../icons/svgProvider';
import { InputBase, StyledBase } from './AccountSearchbar.styles';

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
      {AccountIcons.searchIcon}
    </StyledBase>
  );
};

export default AccountSearchbar;
