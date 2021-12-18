import { atom, selector, useRecoilValue } from 'recoil';
import { Account, AccountEvents } from '../../../typings/accounts';
import { fetchNui } from '../utils/fetchNui';
import { ServerPromiseResp } from '../../../typings/common';
import { isEnvBrowser } from '../utils/misc';
import { MockAccounts } from '../components/accounts/utils/constants';

export const accountsState = {
  accounts: atom<Account[]>({
    key: 'defaultAccounts',
    default: selector({
      key: 'defaultAccountsValue',
      get: async () => {
        try {
          const res = await fetchNui<ServerPromiseResp<Account[]>>(AccountEvents.GetAccounts);

          return res.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return MockAccounts;
          }
          console.error(e);
          return null;
        }
      },
    }),
  }),
  filterInput: atom<string>({
    key: 'defaultAccountsFilter',
    default: '',
  }),
  filteredAccounts: selector({
    key: 'defaultFilteredAccountsValue',
    get: ({ get }) => {
      const accounts: Account[] = get(accountsState.accounts);

      return accounts;
    },
  }),
};

export const useAccountsValue = () => useRecoilValue(accountsState.filteredAccounts);
