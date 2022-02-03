import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import IconLabelButton, { IconButton } from '../../components/IconLabelButton';
import AddIcon from '@mui/icons-material/Add';
import { Account } from '../../../../typings/accounts';
import AccountList from './AccountList';
import { useFilteredAccountsValue, useSetActiveAccount } from './hooks/accounts.state';
import AccountSearchbar from './components/AccountSearchbar';
import NewAccountModal from './components/NewAccountModal';
import { useTranslation } from 'react-i18next';
import { useAccountActions } from './hooks/useAccountActions';

const AccountsSidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { getDefaultAccount } = useAccountActions();
  const [t] = useTranslation();

  const setActiveAccount = useSetActiveAccount();
  const filteredAccounts = useFilteredAccountsValue();

  // We need a function that gets the default account. As of now, it will select the default account each time the accounts state is updated.
  useEffect(() => {
    const account = getDefaultAccount();
    setActiveAccount(account);
  }, [setActiveAccount, getDefaultAccount]);

  const handleChangeAccounts = useCallback(
    (account: Account) => {
      setActiveAccount(account);
    },
    [setActiveAccount],
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box>
      <AccountSearchbar />
      <AccountList accounts={filteredAccounts} handleChangeAccount={handleChangeAccounts} />
      <NewAccountModal isOpen={isModalOpen} onClose={closeModal} />
    </Box>
  );
};

export default AccountsSidebar;
