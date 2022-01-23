import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import IconLabelButton from '../../components/IconLabelButton';
import AddIcon from '@mui/icons-material/Add';
import { Account } from '../../../../typings/accounts';
import AccountList from './AccountList';
import {
  useAccountsValue,
  useFilteredAccountsValue,
  useSetActiveAccount,
} from './hooks/accounts.state';
import AccountSearchbar from './components/AccountSearchbar';
import NewAccountModal from './components/NewAccountModal';
import { useTranslation } from 'react-i18next';

const AccountsSidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredAccounts = useFilteredAccountsValue();
  const accounts = useAccountsValue();
  const setActiveAccount = useSetActiveAccount();
  const [t] = useTranslation();

  useEffect(() => {
    setActiveAccount(accounts[0]);
  }, []);

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
    <Box sx={{ ml: 1 }}>
      <IconLabelButton
        onClick={openModal}
        size="small"
        sx={{ mb: 1 }}
        variant="contained"
        icon={<AddIcon />}
      >
        {t('accounts.actions.newAccount')}
      </IconLabelButton>
      <AccountSearchbar />
      <AccountList accounts={filteredAccounts} handleChangeAccount={handleChangeAccounts} />
      <NewAccountModal isOpen={isModalOpen} onClose={closeModal} />
    </Box>
  );
};

export default AccountsSidebar;
