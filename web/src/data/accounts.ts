import { atom } from 'jotai';
import { Account, AccountEvents } from '../../../typings/accounts';
import { mockedAccounts } from '../features/accounts/utils/constants';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const getDefaultAccounts = async (): Promise<Account[]> => {
  try {
    const res = await fetchNui<Account[]>(AccountEvents.GetAccounts);
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedAccounts;
    }
    console.error(e);
    return [];
  }
};

export const accountsAtom = atom(async () => {
  return await getDefaultAccounts();
});

export const totalBalanceAtom = atom((get) =>
  get(accountsAtom).reduce((prev, curr) => prev + curr.balance, 0),
);

export const activeAccountAtomId = atom<number>(0);
export const activeAccountAtom = atom(
  (get) => get(accountsAtom).find((account) => account.id === get(activeAccountAtomId)),
  (_get, set, str: number) => set(activeAccountAtomId, str),
);

export const defaultAccountAtom = atom(
  (get) => get(accountsAtom).find((account) => account.isDefault) ?? get(accountsAtom)[0],
);
