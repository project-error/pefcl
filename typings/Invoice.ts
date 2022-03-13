export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface InvoiceInput {
  from: string;
  to: string;
  amount: number;
  message: string;
  expiresAt?: string;
}
export interface Invoice {
  id: number;
  amount: number;
  from: string;
  to: string;
  message: string;

  status: InvoiceStatus;
  expiresAt?: string;
  createdAt?: string;
}

export interface PayInvoiceInput {
  invoiceId: number;
  fromAccountId: number;
}
