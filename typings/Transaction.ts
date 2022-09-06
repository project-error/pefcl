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

  updatedAt?: string | number | Date;
  createdAt?: string | number | Date;
}

export interface GetTransactionsInput {
  limit: number;
  offset: number;
}

export interface GetTransactionsResponse extends GetTransactionsInput {
  total: number;
  transactions: Transaction[];
}

export interface TransactionInput {
  type: Transaction['type'];
  amount: Transaction['amount'];
  message: Transaction['message'];
  toAccount?: Transaction['toAccount'];
  fromAccount?: Transaction['fromAccount'];
}

export interface CreateTransferInput {
  number?: string;
  toAccountId: number;
  fromAccountId: number;
  message: string;
  amount: number;
  type: TransferType;
}

export type IncomeExpense = { income: number; expenses: number };
export interface GetTransactionHistoryResponse {
  income: number;
  expenses: number;
  lastWeek: Record<string, IncomeExpense>;
}
