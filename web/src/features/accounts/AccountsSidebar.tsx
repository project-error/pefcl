import React, { useCallback } from 'react';
import { useAccountsValue } from '../hooks/accounts.state';
import { Box, Button, Divider, Grid, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountList from './AccountList';
import AccountSearchbar from './components/AccountSearchbar';
import IconLabelButton from '../../components/IconLabelButton';
import AddIcon from '@mui/icons-material/Add';

const AccountsSidebar: React.FC = () => {
  const accounts = useAccountsValue();

  const navigate = useNavigate();

  const handleChangeAccount = useCallback(
    (id: string) => {
      navigate(`/account/${id}`);
    },
    [accounts, navigate],
  );

  return (
    <Grid item xs={3} sx={{ ml: 1 }}>
      <AccountSearchbar />
      <Divider />
      <IconLabelButton size="small" sx={{ mb: 1 }} variant="contained" icon={<AddIcon />}>
        New account
      </IconLabelButton>
      <Divider />
      <AccountList accounts={accounts} handleChangeAccount={handleChangeAccount} />
    </Grid>
  );
};

export default AccountsSidebar;
