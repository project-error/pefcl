import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { Account, AccountEvents } from '../../../../../typings/accounts';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/http';
import { isEnvBrowser } from '../../../utils/misc';
import { MockAccounts } from '../utils/constants';

export const accountsState = {
  accounts: atom<Account[]>({
    key: 'defaultAccounts',
    default: selector({
      key: 'defaultAccountsValue',
      get: async () => {
        try {
          const res = await fetchNui<void, ServerPromiseResp<Account[]>>(AccountEvents.GetAccounts);

          console.log('got accounts', res.data);
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
  /*
  filteredAccounts: selector({
    key: 'defaultFilteredAccountsValue',
    get: ({ get }) => {
      const searchValue: string = get(accountsState.filterInput);
      const accounts: Account[] = get(accountsState.accounts);

      const regExp = new RegExp(searchValue, 'gi');

      return accounts.filter((acc) => acc.accountName.match(regExp));
    },
  }),
*/
  activeAccount: atom<Account>({
    key: 'defaultActiveAccount',
    default: null,
  }),
};

export const useAccountsValue = () => useRecoilValue(accountsState.accounts);
export const useSetFilteredAccounts = () => useSetRecoilState(accountsState.filterInput);

export const useSetActiveAccount = () => useSetRecoilState(accountsState.activeAccount);
export const useActiveAccountValue = () => useRecoilValue(accountsState.activeAccount);
