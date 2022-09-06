import { atom } from 'jotai';
import { mockedInvoices } from '@utils/constants';
import { InvoiceEvents } from '@typings/Events';
import { GetInvoicesInput, GetInvoicesResponse, InvoiceStatus } from '../../../typings/Invoice';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const initialState: GetInvoicesResponse = {
  total: 0,
  offset: 0,
  limit: 10,
  totalUnpaid: 0,
  invoices: [],
};

const getInvoices = async (input: GetInvoicesInput): Promise<GetInvoicesResponse> => {
  try {
    const res = await fetchNui<GetInvoicesResponse>(InvoiceEvents.Get, input);
    return res ?? initialState;
  } catch (e) {
    if (isEnvBrowser()) {
      return {
        ...initialState,
        invoices: mockedInvoices,
      };
    }
    console.error(e);
    return initialState;
  }
};

const invoicesAtomRaw = atom<GetInvoicesResponse>(initialState);
export const invoicesAtom = atom(
  async (get) => {
    const hasTransactions = get(invoicesAtomRaw).invoices.length > 0;
    return hasTransactions ? get(invoicesAtomRaw) : await getInvoices({ ...initialState });
  },
  async (get, set) => {
    const currentSettings = get(invoicesAtomRaw);
    return set(invoicesAtomRaw, await getInvoices(currentSettings));
  },
);

export const unpaidInvoicesAtom = atom((get) => {
  return get(invoicesAtom).invoices.filter((invoice) => invoice.status === InvoiceStatus.PENDING);
});

export const totalInvoicesAtom = atom((get) => get(invoicesAtom).total);
export const totalUnpaidInvoicesAtom = atom((get) => get(invoicesAtom).totalUnpaid);
