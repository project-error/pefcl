import { totalBalanceAtom } from '@data/accounts';
import { useConfig } from '@hooks/useConfig';
import { Stack } from '@mui/material';
import { formatMoney } from '@utils/currency';
import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PreHeading } from './ui/Typography/BodyText';
import { Heading1 } from './ui/Typography/Headings';

const TotalBalance = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);

  return (
    <Stack>
      <PreHeading>{t('Total balance')}</PreHeading>
      <Heading1>{formatMoney(totalBalance, config.general)}</Heading1>
    </Stack>
  );
};

export default TotalBalance;
