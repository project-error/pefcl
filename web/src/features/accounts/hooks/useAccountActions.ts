import { useRecoilCallback } from 'recoil';
import { accountsState } from './accounts.state';
import { Account } from '../../../../../typings/accounts';

interface IUseAccountActions {
  findAccountById: (id: string) => Account | null;
}

export const useAccountActions = (): IUseAccountActions => {
  const findAccountById = useRecoilCallback<[string], Account | null>(
    ({ snapshot }) =>
      (id: string) => {
        const { state, contents } = snapshot.getLoadable(accountsState.accounts);

        if (state !== 'hasValue') return;

        for (const account of contents) {
          if (account.id === id) return account;
        }

        return null;
      },
    [],
  );

  return { findAccountById };
};
