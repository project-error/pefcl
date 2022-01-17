import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import IconLabelButton from '../../components/IconLabelButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useActiveAccountValue } from '../accounts/hooks/accounts.state';
import DetailsSkeleton from './components/DetailsSkeleton';
import { AccountType } from '../../../../typings/accounts';

const BankDetails: React.FC = () => {
  const account = useActiveAccountValue();

  if (!account) return <DetailsSkeleton />;

  return (
    <>
      <Stack direction="row" spacing={4}>
        <Box>
          <Box sx={{ mt: -1 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Your balance
            </Typography>
          </Box>
          <Typography variant="h4" style={{ fontWeight: 'bold' }} sx={{ color: 'text.primary' }}>
            ${account.balance}
          </Typography>
        </Box>
        {account.type === AccountType.Personal && (
          <Box>
            <IconLabelButton variant="contained" size="small" icon={<SettingsIcon />}>
              Permissions
            </IconLabelButton>
          </Box>
        )}
      </Stack>
      {/*
      <Box>
        <List>
          {MockTransactions.map((t) => (
            <TransactionItem {...t} />
          ))}
        </List>
      </Box>
*/}
    </>
  );
};

export default BankDetails;
