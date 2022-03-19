import { Account } from './Account';

export enum TransactionType {
  Outgoing = 'Outgoing',
  Incoming = 'Incoming',
  Transfer = 'Transfer',
}
export interface Transaction {
  id: number;
  identifier: string;

  toAccount?: Account;
  fromAccount?: Account;
  type: TransactionType;

  amount: number;
  message: string;

  updatedAt?: string | number | Date;
  createdAt?: string | number | Date;
}

export interface Transfer {
  toAccountId: number;
  fromAccountId: number;
  message: string;
  amount: number;
}
