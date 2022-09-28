import AccountSelect from '@components/AccountSelect';
import Layout from '@components/Layout';
import Button from '@components/ui/Button';
import PriceField from '@components/ui/Fields/PriceField';
import NewBalance from '@components/ui/NewBalance';
import { Heading2, Heading6 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { useConfig } from '@hooks/useConfig';
import { Error } from '@mui/icons-material';
import { Alert, LinearProgress, Stack, Typography } from '@mui/material';
import { ATMInput } from '@typings/Account';
import { BalanceErrors } from '@typings/Errors';
import { AccountEvents, CashEvents } from '@typings/Events';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Withdraw = () => {
  const { t } = useTranslation();
  const [currentCash, setCurrentCash] = useState(0);
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number>();
  const [, updateAccounts] = useAtom(accountsAtom);
  const [accounts] = useAtom(accountsAtom);
  const { general } = useConfig();
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (selectedAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;
  const isValidTransaction = Boolean(amount) && value > 0 && selectedAccountId;
  const isButtonDisabled = !isValidNewBalance || !isValidTransaction || isLoading;

  useEffect(() => {
    fetchNui<number>(CashEvents.GetMyCash).then((cash) => setCurrentCash(cash ?? 0));
  }, [success]);

  const handleWithdrawal = () => {
    const payload: ATMInput = {
      amount: value,
      message: t('Withdrew {{amount}} from account.', { amount: formatMoney(value, general) }),
      accountId: selectedAccountId,
    };

    setSuccess('');
    setError('');
    setIsLoading(true);
    fetchNui<ATMInput>(AccountEvents.WithdrawMoney, payload)
      .then(() => {
        setAmount('');
        setCurrentCash(newBalance);
        updateAccounts();
        setSuccess(
          t('Successfully withdrew {{amount}}.', {
            amount: formatMoney(value, general),
          }),
        );
      })
      .catch((err: Error) => {
        if (err.message === BalanceErrors.InsufficentFunds) {
          setError(t('Insufficent funds'));
          return;
        }

        setError(err.message ?? t('Something went wrong'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <Heading2>{t('Withdraw')}</Heading2>

      <Stack spacing={0.5} marginTop={4}>
        <Heading6>{t('Current cash')}</Heading6>
        <Typography>{formatMoney(currentCash, general)}</Typography>
      </Stack>

      <Stack spacing={2} marginTop={4} maxWidth="25rem">
        <Stack spacing={1}>
          <Heading6>{t('Select account')}</Heading6>
          <AccountSelect
            isFromAccount
            accounts={accounts}
            onSelect={setSelectedAccountId}
            selectedId={selectedAccountId}
          />
        </Stack>

        <Stack spacing={1}>
          <Heading6>{t('Amount')}</Heading6>
          <PriceField
            placeholder={t('Amount')}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <NewBalance amount={newBalance} isValid={isValidNewBalance} />
        </Stack>

        <Button size="large" disabled={isButtonDisabled} onClick={handleWithdrawal}>
          {t('Withdraw')}
        </Button>

        {success && <Alert color="info">{success}</Alert>}
        {error && (
          <Alert icon={<Error />} color="error">
            {error}
          </Alert>
        )}
        {isLoading && <LinearProgress />}
      </Stack>
    </Layout>
  );
};

export default Withdraw;
