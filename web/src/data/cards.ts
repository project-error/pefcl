import { Card, GetCardInput } from '@typings/BankCard';
import { CardEvents } from '@typings/Events';
import { mockedAccounts } from '@utils/constants';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const mockedCards: Card[] = [
  {
    id: 1,
    account: mockedAccounts[0],
    isBlocked: false,
    number: '4242 4220 1234 9000',
    holder: 'Charles Carlsberg',
    pin: 1234,
    holderCitizenId: '1',
  },
  {
    id: 2,
    account: mockedAccounts[0],
    isBlocked: false,
    number: '4242 4220 1234 9002',
    holder: 'Charles Carlsberg',
    pin: 1234,
    holderCitizenId: '2',
  },
  {
    id: 3,
    account: mockedAccounts[0],
    isBlocked: false,
    number: '4242 4220 1234 9003',
    holder: 'Charles Carlsberg',
    pin: 1234,
    holderCitizenId: '3',
  },
];

const getCards = async (accountId: number): Promise<Card[]> => {
  try {
    const res = await fetchNui<Card[], GetCardInput>(CardEvents.Get, { accountId });
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedCards;
    }

    console.error(e);
    return [];
  }
};

export const selectedAccountIdAtom = atom<number>(0);

export const rawCardAtom = atomWithStorage<Record<number, Card[]>>('rawCards', {});
export const cardsAtom = atom(
  async (get) => {
    const selectedCardId = get(selectedAccountIdAtom);
    const state = get(rawCardAtom);

    return state[selectedCardId] ?? [];
  },
  async (get, set, by: Card | number) => {
    const selectedCardId = get(selectedAccountIdAtom);
    const state = get(rawCardAtom);

    if (typeof by === 'number') {
      const cards = await getCards(by);
      return set(rawCardAtom, { ...state, [selectedCardId]: cards });
    }

    if (!by) {
      const cards = await getCards(selectedCardId);
      return set(rawCardAtom, { ...state, [selectedCardId]: cards });
    }

    const cards = state[selectedCardId];
    return set(rawCardAtom, { ...state, [selectedCardId]: [...cards, by] });
  },
);
