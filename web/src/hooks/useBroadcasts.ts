import { accountsAtom } from '@data/accounts';
import { invoicesAtom } from '@data/invoices';
import { transactionBaseAtom } from '@data/transactions';
import { Broadcasts } from '@typings/Events';
import { useAtom } from 'jotai';
import { useNuiEvent } from 'react-fivem-hooks';

export const useBroadcasts = () => {
  const [, updateInvoices] = useAtom(invoicesAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [, updateAccounts] = useAtom(accountsAtom);

  useNuiEvent({
    event: Broadcasts.NewTransaction,
    callback: () => {
      updateTransactions();
      updateAccounts();
    },
  });

  useNuiEvent({
    event: Broadcasts.NewInvoice,
    callback: () => {
      updateInvoices();
    },
  });

  useNuiEvent({
    event: Broadcasts.NewSharedUser,
    callback: () => {
      updateAccounts();
    },
  });

  useNuiEvent({
    event: Broadcasts.RemovedSharedUser,
    callback: () => {
      updateAccounts();
    },
  });
};

export const BroadcastsWrapper = () => {
  useBroadcasts();
  return null;
};
