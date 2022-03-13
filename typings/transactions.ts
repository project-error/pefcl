import { Account } from './accounts';

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

  createdAt?: string;
  updatedAt?: string;
}

export interface Transfer {
  toAccountId: number;
  fromAccountId: number;
  message: string;
  amount: number;
}
