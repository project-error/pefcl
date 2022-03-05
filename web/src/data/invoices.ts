import { atom } from 'jotai';
import { InvoiceEvents } from '../../../typings/accounts';
import { Invoice, InvoiceStatus } from '../../../typings/Invoice';
import { mockedInvoices } from '../features/accounts/utils/constants';
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

export const invoicesAtom = atom(async () => {
  return await getInvoices();
});

export const pendingInvoicesAtom = atom((get) => {
  return get(invoicesAtom).filter((invoice) => invoice.status === InvoiceStatus.PENDING);
});

export const totalInvoices = atom((get) => get(invoicesAtom).length);
export const totalPendingInvoices = atom((get) => get(pendingInvoicesAtom).length);
