import React from 'react';
import { Stack, Typography, Box, List, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAccountActions } from '../accounts/hooks/useAccountActions';
import { MockTransactions } from '../accounts/utils/constants';
import TransactionItem from './components/TransactionItem';
import IconLabelButton from '../../components/IconLabelButton';
import SettingsIcon from '@mui/icons-material/Settings';

const BankDetails: React.FC = () => {
  const { id } = useParams();
  const { findAccountById } = useAccountActions();
  const currentAccount = findAccountById(id);

  return (
    <>
      <React.Suspense fallback={<CircularProgress />}>
        <Stack direction="row" spacing={4}>
          <Box>
            <Box sx={{ mt: -1 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Your balance
              </Typography>
            </Box>
            <Typography variant="h4" style={{ fontWeight: 'bold' }} sx={{ color: 'text.primary' }}>
              ${currentAccount?.balance}
            </Typography>
          </Box>
          <Box>
            <IconLabelButton variant="contained" size="small" icon={<SettingsIcon />}>
              Permissions
            </IconLabelButton>
          </Box>
        </Stack>
        <Box>
          <List>
            {MockTransactions.map((t) => (
              <TransactionItem {...t} />
            ))}
          </List>
        </Box>
      </React.Suspense>
    </>
  );
};

export default BankDetails;
