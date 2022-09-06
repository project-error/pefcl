import { AccountCard } from '@components/Card';
import TotalBalance from '@components/TotalBalance';
import { Heading5 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MobileAccountsView = () => {
  const { t } = useTranslation();
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

        {accounts.length <= 1 && (
          <Stack spacing={1}>
            <Heading5>{t('You can create more accounts by visiting the nearest bank ..')}</Heading5>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default MobileAccountsView;
