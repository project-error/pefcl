import React, { useMemo } from 'react';
import { Button, Grid, Paper, Stack, Typography, Box, List } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAccountActions } from '../accounts/hooks/useAccountActions';
import { MockTransactions } from '../accounts/utils/constants';
import TransactionItem from './components/TransactionItem';

const BankDetails: React.FC = () => {
  const { id } = useParams();
  const { findAccountById } = useAccountActions();

  const currentAccount = findAccountById(id);

  return (
    <Box>
      <Box sx={{ mt: -1 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Your balance
        </Typography>
      </Box>
      <Typography variant="h4" style={{ fontWeight: 'bold' }} sx={{ color: 'text.primary' }}>
        ${currentAccount?.balance}
      </Typography>
      <Box>
        <List>
          {MockTransactions.map((t) => (
            <TransactionItem {...t} />
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default BankDetails;
