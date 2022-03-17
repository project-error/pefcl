import { atom } from 'jotai';
import { TransactionEvents } from '@typings/Events';
import { Transaction } from '../../../typings/transactions';
import { mockedTransactions } from '../utils/constants';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const res = await fetchNui<Transaction[]>(TransactionEvents.Get);
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedTransactions;
    }
    console.error(e);
    return [];
  }
};

export const rawTransactionsAtom = atom<Transaction[]>([]);
export const transactionsAtom = atom(
  async (get) => {
    const transactions =
      get(rawTransactionsAtom).length === 0 ? await getTransactions() : get(rawTransactionsAtom);
    const sorted = transactions.sort((a, b) =>
      (a?.createdAt ?? '') > (b?.createdAt ?? '') ? -1 : 1,
    );

    return sorted;
  },
  async (_get, set) => {
    return set(rawTransactionsAtom, await getTransactions());
  },
);

export const totalNumberOfTransaction = atom((get) => get(transactionsAtom).length);
