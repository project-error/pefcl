import React, { useState } from 'react';
import { Alert, Box, FormHelperText, LinearProgress, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { accountsAtom, defaultAccountAtom } from '../data/accounts';
import { Heading5 } from './ui/Typography/Headings';
import AccountSelect from './AccountSelect';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';
import PriceField from './ui/Fields/PriceField';
import { fetchNui } from '../utils/fetchNui';
import { transactionBaseAtom } from 'src/data/transactions';
import { TransactionEvents } from '@typings/Events';
import { CreateTransferInput, TransferType } from '@typings/Transaction';
import { externalAccountsAtom } from '@data/externalAccounts';
import { GenericErrors } from '@typings/Errors';
import NewBalance from './ui/NewBalance';

const TransferFunds: React.FC<{ onClose?(): void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [externalAccounts] = useAtom(externalAccountsAtom);
  const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id ?? 0);
  const [toAccountId, setToAccountID] = useState(0);
  const [isTransfering, setIsTransfering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const parsedAmount = Number(amount.replace(/\D/g, ''));
  const fromAccount = accounts.find((account) => account.id === fromAccountId);

  const isExternalTransfer = externalAccounts.some((e) => e.id === toAccountId);
  const message = isExternalTransfer ? t('External transfer') : t('Internal transfer');
  const type = isExternalTransfer ? TransferType.External : TransferType.Internal;

  const handleTransfer = async () => {
    setIsTransfering(true);
    setError('');
    setSuccess('');

    const payload: CreateTransferInput = {
      type,
      message,
      amount: parsedAmount,
      fromAccountId,
      toAccountId: toAccountId,
    };

    try {
      await fetchNui(TransactionEvents.CreateTransfer, payload);
      await updateAccounts();
      await updateTransactions();
      onClose?.();
      setAmount('');
      setSuccess(t('Successfully transferred funds'));
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message === GenericErrors.NotFound) {
        setError(t('No account found to receive transfer.'));
      } else {
        setError(t('Something went wrong, please try again later.'));
      }
    }

    setIsTransfering(false);
  };

  const isAmountTooHigh = fromAccount && fromAccount.balance < parsedAmount;
  const isAmountTooLow = parsedAmount <= 0;
  const isToAccountSelected = toAccountId > 0;
  const isSameAccount = toAccountId === fromAccountId;
  const isDisabled =
    isSameAccount || !parsedAmount || !isToAccountSelected || isAmountTooHigh || isAmountTooLow;

  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (fromAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;

  return (
    <>
      <Box p="2rem 0 0" display="flex" flexDirection="column">
        <Stack spacing={4}>
          <Stack direction="row" spacing={4}>
            <Stack flex={1} spacing={1}>
              <Heading5>{t('From account')}</Heading5>
              <AccountSelect
                isFromAccount
                onSelect={setFromAccountId}
                accounts={accounts}
                selectedId={fromAccountId}
              />
            </Stack>

            <Stack flex={1} spacing={1}>
              <Heading5>{t('To account')}</Heading5>
              <AccountSelect
                onSelect={setToAccountID}
                accounts={accounts}
                selectedId={toAccountId}
                externalAccounts={externalAccounts}
              />
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Heading5>{t('Amount')}</Heading5>
            <PriceField
              placeholder={t('Amount')}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <NewBalance amount={newBalance} isValid={isValidNewBalance} />
          </Stack>

          <FormHelperText>{error}</FormHelperText>

          {success && <Alert color="info">{success}</Alert>}

          <Stack alignSelf="flex-end" direction="row" spacing={4}>
            <Button disabled={isDisabled} onClick={handleTransfer}>
              {t('Transfer funds')}
            </Button>
          </Stack>
        </Stack>
      </Box>
      {isTransfering && <LinearProgress />}
    </>
  );
};

export default TransferFunds;
