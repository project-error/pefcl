export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface Invoice {
  id: number;
  amount: number;
  from: string;
  message: string;

  status: InvoiceStatus;
  expiresAt: string;
  createdAt: string;
}
