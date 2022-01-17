import React, { useCallback, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import IconLabelButton from '../../components/IconLabelButton';
import AddIcon from '@mui/icons-material/Add';
import { Account, AccountEvents } from '../../../../typings/accounts';
import { fetchNui } from '../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../typings/http';
import AccountList from './AccountList';
import { useAccountsValue } from './hooks/accounts.state';
import AccountSearchbar from './components/AccountSearchbar';

const AccountsSidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const accounts = useAccountsValue();

  const handleChangeAccounts = (account: Account) => {
    console.log('account', account);
  };

  return (
    <Box sx={{ ml: 1 }}>
      <IconLabelButton
        onClick={() => setIsModalOpen(false)}
        size="small"
        sx={{ mb: 1 }}
        variant="contained"
        icon={<AddIcon />}
      >
        New account
      </IconLabelButton>
      <AccountSearchbar />
      <AccountList accounts={accounts} handleChangeAccount={handleChangeAccounts} />
    </Box>
  );
};

export default AccountsSidebar;
