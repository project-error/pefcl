import { fetchNui } from '../../../utils/fetchNui';
import { Account, AccountEvents, PreDBAccount } from '../../../../../typings/accounts';
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
      fetchNui<PreDBAccount, ServerPromiseResp<Account>>(AccountEvents.CreateAccount, {
        accountName,
      }).then((res) => {
        if (res.status !== 'ok') {
          return enqueueSnackbar('Failed to create an account. Try again later', {
            variant: 'error',
          });
        }

        setAccounts((curAccounts) => [...curAccounts, res.data]);
        setActiveAccount(res.data);
        enqueueSnackbar('Successfully created a new account', { variant: 'success' });
      });
    },
    [setAccounts, setActiveAccount, enqueueSnackbar],
  );

  const deleteAccount = useCallback(
    (account: Account) => {
      fetchNui<Account, ServerPromiseResp<void>>(AccountEvents.DeleteAccount, account).then(
        (res) => {
          if (res.status !== 'ok') {
            return enqueueSnackbar('Failed to delete the account. Try again later.', {
              variant: 'error',
            });
          }

          setAccounts((curAccounts) => curAccounts.filter((acc) => acc.id !== account.id));
          enqueueSnackbar('Successfully deleted the account.', { variant: 'success' });
        },
      );
    },
    [setAccounts, enqueueSnackbar],
  );
  return { createAccount, deleteAccount };
};
