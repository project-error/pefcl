import React, { useCallback, useEffect, useState } from 'react';
import { useAccountsValue, useSetActiveAccount } from './hooks/accounts.state';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountList from './AccountList';
import AccountSearchbar from './components/AccountSearchbar';
import IconLabelButton from '../../components/IconLabelButton';
import AddIcon from '@mui/icons-material/Add';
import NewAccountModal from './components/NewAccountModal';
import { Account } from '../../../../typings/accounts';

const AccountsSidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const accounts = useAccountsValue();
  const setActiveAccount = useSetActiveAccount();
  const navigate = useNavigate();

  const handleChangeAccount = useCallback(
    (account: Account) => {
      navigate(`/${account.id}`);
      setActiveAccount(account);
    },
    [navigate, setActiveAccount],
  );

  /*
  useEffect(() => {
    navigate(`/${accounts[0].id}`);
    setActiveAccount(accounts[0]);
  }, [accounts]);
*/

  if (!accounts) return <CircularProgress />;

  return (
    <React.Suspense fallback={<CircularProgress />}>
      <Box sx={{ ml: 1 }}>
        <IconLabelButton
          onClick={() => setIsModalOpen(true)}
          size="small"
          sx={{ mb: 1 }}
          variant="contained"
          icon={<AddIcon />}
        >
          New account
        </IconLabelButton>
        {/*
        <AccountSearchbar />
*/}
        <AccountList accounts={accounts} handleChangeAccount={handleChangeAccount} />
        <NewAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </Box>
    </React.Suspense>
  );
};

export default AccountsSidebar;
