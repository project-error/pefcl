import { accountsAtom, rawAccountAtom } from '@data/accounts';
import { invoicesAtom } from '@data/invoices';
import { transactionBaseAtom } from '@data/transactions';
import { Account } from '@typings/Account';
import { Broadcasts } from '@typings/Events';
import { updateAccount } from '@utils/account';
import { useAtom, useSetAtom } from 'jotai';
import { useNuiEvent } from 'react-fivem-hooks';

export const useBroadcasts = () => {
  const updateInvoices = useSetAtom(invoicesAtom);
  const updateTransactions = useSetAtom(transactionBaseAtom);
  const setRawAccounts = useSetAtom(rawAccountAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);

  useNuiEvent({
    event: Broadcasts.NewTransaction,
    callback: () => {
      updateTransactions();
    },
  });

  useNuiEvent({
    event: Broadcasts.NewAccount,
    callback: (account: Account) => {
      setRawAccounts([...accounts, account]);
    },
  });

  useNuiEvent({
    event: Broadcasts.UpdatedAccount,
    callback: () => {
      updateAccounts();
    },
  });

  useNuiEvent({
    event: Broadcasts.NewAccountBalance,
    callback: (account: Account) => {
      setRawAccounts(updateAccount(accounts, account));
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
