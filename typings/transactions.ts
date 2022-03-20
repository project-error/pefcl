import { Account } from './Account';

export enum TransactionType {
  Outgoing = 'Outgoing',
  Incoming = 'Incoming',
  Transfer = 'Transfer',
}

export enum TransferType {
  Internal = 'Internal',
  External = 'External',
}
export interface Transaction {
  id: number;
  toAccount?: Account;
  fromAccount?: Account;

  amount: number;
  message: string;
  type: TransactionType;

  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionInput {
  type: Transaction['type'];
  amount: Transaction['amount'];
  message: Transaction['message'];
  toAccount?: Transaction['toAccount'];
  fromAccount?: Transaction['fromAccount'];
}

export interface Transfer {
  number?: string;
  toAccountId: number;
  fromAccountId: number;
  message: string;
  amount: number;
  type: TransferType;
}
