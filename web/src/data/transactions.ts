import { atom } from 'jotai';
import { TransactionEvents } from '../../../typings/accounts';
import { Transaction } from '../../../typings/transactions';
import { mockedTransactions } from '../features/accounts/utils/constants';
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

export const transactionsAtom = atom(async () => {
  return await getTransactions();
});

export const totalNumberOfTransaction = atom((get) => get(transactionsAtom).length);
