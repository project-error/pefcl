import { fetchNui } from '../../../utils/fetchNui';
import { Account, AccountEvents } from '../../../../../typings/accounts';
import { ServerPromiseResp } from '../../../../../typings/http';
import { useCallback } from 'react';
import { useSetAccounts, useSetActiveAccount } from '../hooks/accounts.state';
import { useSnackbar } from 'notistack';

interface IUseAccountAPI {
  createAccount: (accountName: string) => void;
  deleteAccount: (account: Account) => void;
}

export const useAccountAPI = (): IUseAccountAPI => {
  const setAccounts = useSetAccounts();
  const setActiveAccount = useSetActiveAccount();
  const { enqueueSnackbar } = useSnackbar();

  const createAccount = useCallback(
    (accountName: string) => {
      fetchNui<Account>(AccountEvents.CreateAccount, {
        accountName,
      })
        .then((data) => {
          data && setAccounts((curAccounts) => [...curAccounts, data]);
          data && setActiveAccount(data);
          enqueueSnackbar('Successfully created a new account', { variant: 'success' });
        })
        .catch(() => {
          enqueueSnackbar('Failed to create an account. Try again later', {
            variant: 'error',
          });
        });
    },
    [setAccounts, setActiveAccount, enqueueSnackbar],
  );

  const deleteAccount = useCallback(
    (account: Account) => {
      fetchNui<ServerPromiseResp<void>>(AccountEvents.DeleteAccount, account)
        .then(() => {
          setAccounts((curAccounts) => curAccounts.filter((acc) => acc.id !== account.id));
          enqueueSnackbar('Successfully deleted the account.', { variant: 'success' });
        })
        .catch(() => {
          return enqueueSnackbar('Failed to delete the account. Try again later.', {
            variant: 'error',
          });
        });
    },
    [setAccounts, enqueueSnackbar],
  );
  return { createAccount, deleteAccount };
};
