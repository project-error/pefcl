import { ExternalAccount } from '@typings/Account';
import { ExternalAccountEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import { atom } from 'jotai';

const getExternalAccounts = async (): Promise<ExternalAccount[]> => {
  try {
    const res = await fetchNui<ExternalAccount[]>(ExternalAccountEvents.Get);
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return [
        {
          id: 1,
          name: 'Bossman',
          number: '803, 5800-6000-7000',
        },
      ];
    }
    console.error(e);
    return [];
  }
};

const rawExternalAccountsAtom = atom<ExternalAccount[]>([]);
export const externalAccountsAtom = atom(
  async (get) => {
    const accounts =
      get(rawExternalAccountsAtom).length === 0
        ? await getExternalAccounts()
        : get(rawExternalAccountsAtom);
    return accounts;
  },
  async (_get, set) => {
    return set(rawExternalAccountsAtom, await getExternalAccounts());
  },
);
