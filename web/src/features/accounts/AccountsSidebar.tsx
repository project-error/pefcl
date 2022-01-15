import React, { useCallback, useEffect, useState } from 'react';
import { useAccountsValue } from './hooks/accounts.state';
import { Divider, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountList from './AccountList';
import AccountSearchbar from './components/AccountSearchbar';
import IconLabelButton from '../../components/IconLabelButton';
import AddIcon from '@mui/icons-material/Add';
import NewAccountModal from './components/NewAccountModal';

const AccountsSidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const accounts = useAccountsValue();

  const navigate = useNavigate();

  const handleChangeAccount = useCallback(
    (id: string) => {
      navigate(`/account/${id}`);
    },
    [accounts, navigate],
  );

  useEffect(() => {
    navigate(`/account/${accounts[0].id}`);
  }, []);

  return (
    <Box sx={{ ml: 1 }}>
      <AccountSearchbar />
      <Divider />
      <IconLabelButton
        onClick={() => setIsModalOpen(true)}
        size="small"
        sx={{ mb: 1 }}
        variant="contained"
        icon={<AddIcon />}
      >
        New account
      </IconLabelButton>
      <Divider />
      <AccountList accounts={accounts} handleChangeAccount={handleChangeAccount} />
      <NewAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default AccountsSidebar;
