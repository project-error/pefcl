import { accountsAtom } from '@data/accounts';
import { transactionBaseAtom } from '@data/transactions';
import { TransactionEvents } from '@typings/Events';
import { useAtom } from 'jotai';
import { useNuiEvent } from 'react-fivem-hooks';

export const useUpdates = () => {
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [, updateAccounts] = useAtom(accountsAtom);

  useNuiEvent({
    event: TransactionEvents.NewTransactionBroadcast,
    callback: () => {
      updateTransactions();
      updateAccounts();
    },
  });
};

export const UpdatesWrapper = () => {
  useUpdates();
  return null;
};
