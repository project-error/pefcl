import Button from '@components/ui/Button';
import { Heading2, Heading6 } from '@components/ui/Typography/Headings';
import { accountsAtom, defaultAccountBalance } from '@data/accounts';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Paper, Stack } from '@mui/material';
import { ATMInput } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { defaultWithdrawOptions } from '@utils/constants';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import { AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNuiEvent } from '@hooks/useNuiEvent';

const AnimationContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
`;

const Container = styled(Paper)`
  display: inline-block;
  padding: ${theme.spacing(7)};
  border-radius: ${theme.spacing(3)};
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

const ATM = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const withdrawOptions = config?.atms?.withdrawOptions ?? defaultWithdrawOptions;
  const [isLoading, setIsLoading] = useState(false);
  const [accountBalance] = useAtom(defaultAccountBalance);
  const [, updateAccounts] = useAtom(accountsAtom);

  const [isOpen, setIsOpen] = useState(false);

  useNuiEvent('PEFCL', 'setVisibleATM', (data) => setIsOpen(data));

  const handleWithdraw = (amount: number) => {
    const payload: ATMInput = {
      amount,
      message: 'Withdrew ' + amount + ' from an ATM.',
    };

    setIsLoading(true);
    // TODO: Update this with cards implementation
    fetchNui(AccountEvents.WithdrawMoney, payload)
      .then(() => updateAccounts())
      .finally(() => setIsLoading(false));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <AnimationContainer>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
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
          </motion.div>
        </AnimationContainer>
      )}
    </AnimatePresence>
  );
};

export default ATM;
