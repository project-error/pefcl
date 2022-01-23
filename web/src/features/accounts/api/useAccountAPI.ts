import { fetchNui } from '../../../utils/fetchNui';
import { Account, AccountEvents, PreDBAccount } from '../../../../../typings/accounts';
import { ServerPromiseResp } from '../../../../../typings/http';
import { useCallback } from 'react';
import { useSetAccounts, useSetActiveAccount } from '../hooks/accounts.state';

interface IUseAccountAPI {
  createAccount: (accountName: string) => void;
}

export const useAccountAPI = (): IUseAccountAPI => {
  const setAccounts = useSetAccounts();
  const setActiveAccount = useSetActiveAccount();

  const createAccount = useCallback(
    (accountName: string) => {
      console.log('account name', accountName);
      fetchNui<PreDBAccount, ServerPromiseResp<Account>>(AccountEvents.CreateAccount, {
        accountName,
      }).then((res) => {
        if (res.status !== 'ok') {
          return 'something';
        }

        setAccounts((curAccounts) => [...curAccounts, res.data]);
        setActiveAccount(res.data);
      });
    },
    [setAccounts],
  );

  return { createAccount };
};
