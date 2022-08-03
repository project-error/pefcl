import { AccountCard } from '@components/Card';
import TotalBalance from '@components/TotalBalance';
import { accountsAtom } from '@data/accounts';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useAtom } from 'jotai';
import React from 'react';

const MobileAccountsView = () => {
  const [accounts] = useAtom(accountsAtom);

  return (
    <Box p={4}>
      <Stack spacing={3}>
        <TotalBalance />

        <Stack spacing={2}>
          {accounts.map((account) => {
            return <AccountCard account={account} key={account.id} />;
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MobileAccountsView;
