import React from 'react';
import { Stack, Typography } from '@mui/material';
import { formatMoney } from '@utils/currency';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@hooks/useConfig';

interface NewBalanceProps {
  amount: number;
  isValid: boolean;
  newBalanceText?: string;
}

const NewBalance = ({ amount, isValid, newBalanceText }: NewBalanceProps) => {
  const { t } = useTranslation();
  const { general } = useConfig();

  return (
    <Stack direction="row">
      <Typography variant="caption" color="text.secondary">
        {newBalanceText ?? t('New balance')}
      </Typography>
      <Typography variant="caption" color={isValid ? 'primary.main' : 'error'}>
        : {formatMoney(amount, general)}
      </Typography>
    </Stack>
  );
};

export default NewBalance;
