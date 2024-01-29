import { accountsAtom, rawAccountAtom } from '@data/accounts';
import { invoicesAtom } from '@data/invoices';
import { transactionBaseAtom } from '@data/transactions';
import { Account } from '@typings/Account';
import { Broadcasts } from '@typings/Events';
import { updateAccount } from '@utils/account';
import { useAtom, useSetAtom } from 'jotai';
import { useNuiEvent } from '@hooks/useNuiEvent';

export const useBroadcasts = () => {
  const updateInvoices = useSetAtom(invoicesAtom);
  const updateTransactions = useSetAtom(transactionBaseAtom);
  const setRawAccounts = useSetAtom(rawAccountAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);

  useNuiEvent('PEFCL', Broadcasts.NewTransaction, () => {
    updateTransactions();
  });

  useNuiEvent('PEFCL', Broadcasts.NewAccount, (account: Account) => {
    setRawAccounts([...accounts, account])
  });

  useNuiEvent('PEFCL', Broadcasts.UpdatedAccount, () => {
    updateAccounts();
  });

  useNuiEvent('PEFCL', Broadcasts.NewAccountBalance, (account: Account) => {
    setRawAccounts(updateAccount(accounts, account));
  });

  useNuiEvent('PEFCL', Broadcasts.NewInvoice, () => {
    updateInvoices();
  });

  useNuiEvent('PEFCL', Broadcasts.NewSharedUser, () => {
    updateAccounts();
  });

  useNuiEvent('PEFCL', Broadcasts.RemovedSharedUser, () => {
    updateAccounts();
  });
};

export const BroadcastsWrapper = () => {
  useBroadcasts();
  return null;
};
