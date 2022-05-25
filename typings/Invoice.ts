export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface CreateInvoiceInput {
  to: string;
  from: string;
  amount: number;
  message: string;
  toIdentifier: string;
  fromIdentifier: string;
  recieverAccountId?: number;
  expiresAt?: string;
}

export interface InvoiceOnlineInput {
  source: number;
  amount: number;
  message: string;
}

export interface Invoice {
  id: number;
  amount: number;
  message: string;

  /* Displayed information, on invoice pages and such. */
  to: string;
  from: string;

  /* Personal identifiers */
  toIdentifier: string;
  fromIdentifier: string;

  /* Optional to insert balance to specific account. */
  recieverAccountId?: number;

  status: InvoiceStatus;
  expiresAt?: string;
  createdAt?: string;
}

export interface PayInvoiceInput {
  invoiceId: number;
  fromAccountId: number;
}
