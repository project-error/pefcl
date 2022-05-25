import { atom } from 'jotai';
import { TransactionEvents } from '@typings/Events';
import { GetTransactionsInput, GetTransactionsResponse } from '@typings/Transaction';
import { mockedTransactions } from '../utils/constants';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const initialState: GetTransactionsResponse = {
  total: 0,
  offset: 0,
  limit: 10,
  transactions: [],
};

const getTransactions = async (input: GetTransactionsInput): Promise<GetTransactionsResponse> => {
  try {
    const res = await fetchNui<GetTransactionsResponse>(TransactionEvents.Get, input);
    return res ?? initialState;
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedTransactions;
    }
    console.error(e);
    return initialState;
  }
};

export const rawTransactionsAtom = atom<GetTransactionsResponse>(initialState);

export const transactionBaseAtom = atom(
  async (get) => {
    const hasTransactions = get(rawTransactionsAtom).transactions.length > 0;
    return hasTransactions ? get(rawTransactionsAtom) : await getTransactions({ ...initialState });
  },
  async (get, set, by: Partial<GetTransactionsInput> | undefined) => {
    const currentSettings = get(rawTransactionsAtom);
    return set(rawTransactionsAtom, await getTransactions({ ...currentSettings, ...by }));
  },
);

export const transactionsAtom = atom(async (get) => {
  const transactions = get(transactionBaseAtom).transactions;
  return transactions;
});

export const transactionsTotalAtom = atom((get) => get(transactionBaseAtom).total);
export const transactionsLimitAtom = atom((get) => get(transactionBaseAtom).limit);
export const transactionsOffsetAtom = atom((get) => get(transactionBaseAtom).offset);
