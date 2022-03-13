import { atom } from 'jotai';
import { mockedInvoices } from '@utils/constants';
import { InvoiceEvents } from '../../../typings/accounts';
import { Invoice, InvoiceStatus } from '../../../typings/Invoice';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const res = await fetchNui<Invoice[]>(InvoiceEvents.Get);
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedInvoices;
    }
    console.error(e);
    return [];
  }
};

const invoicesAtomRaw = atom<Invoice[]>([]);
export const invoicesAtom = atom(
  async (get) => {
    return get(invoicesAtomRaw).length ? get(invoicesAtomRaw) : await getInvoices();
  },
  async (_get, set) => {
    return set(invoicesAtomRaw, await getInvoices());
  },
);

export const pendingInvoicesAtom = atom((get) => {
  return get(invoicesAtom).filter((invoice) => invoice.status === InvoiceStatus.PENDING);
});

export const totalInvoices = atom((get) => get(invoicesAtom).length);
export const totalPendingInvoices = atom((get) => get(pendingInvoicesAtom).length);
