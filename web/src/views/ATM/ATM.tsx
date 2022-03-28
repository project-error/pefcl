import Button from '@components/ui/Button';
import { Heading2, Heading6 } from '@components/ui/Typography/Headings';
import { accountsAtom, defaultAccountBalance } from '@data/accounts';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Paper, Stack } from '@mui/material';
import { ATMInput } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Container = styled(Paper)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-15%, -80%);

  display: inline-block;
  margin: 2rem;
  padding: ${theme.spacing(7)};
  border-radius: ${theme.spacing(3)};
  border: 2px solid #fff;
`;

const AccountBalance = styled(Heading6)`
  color: ${theme.palette.text.primary};
  font-weight: ${theme.typography.fontWeightLight};
`;

const Header = styled(Stack)`
  margin-bottom: ${theme.spacing(7)};
`;

const WithdrawText = styled(Heading6)`
  display: block;
  padding-bottom: ${theme.spacing(1.5)};
`;

const WithdrawContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 8rem);
  grid-row-gap: ${theme.spacing(1.5)};
  grid-column-gap: ${theme.spacing(1.5)};
`;

const withdrawOptions = [500, 1000, 1500, 3000, 5000, 7500];

const ATM = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [accountBalance] = useAtom(defaultAccountBalance);
  const [, updateAccounts] = useAtom(accountsAtom);

  const handleWithdraw = (amount: number) => {
    const payload: ATMInput = {
      amount,
      message: 'Withdrew ' + amount + ' from an ATM.',
    };

    setIsLoading(true);
    fetchNui(AccountEvents.WithdrawMoney, payload)
      .then(updateAccounts)
      .finally(() => setIsLoading(false));
  };

  return (
    <Container elevation={4}>
      <Header>
        <AccountBalance>{t('Account balance')}</AccountBalance>
        <Heading2>{formatMoney(accountBalance ?? 0, config.general)}</Heading2>
      </Header>

      <WithdrawText>{t('Quick withdraw')}</WithdrawText>
      <WithdrawContainer>
        {withdrawOptions.map((value) => (
          <Button
            key={value}
            onClick={() => handleWithdraw(value)}
            data-value={value}
            disabled={value > (accountBalance ?? 0) || isLoading}
          >
            {formatMoney(value, config.general)}
          </Button>
        ))}
      </WithdrawContainer>
    </Container>
  );
};

export default ATM;
