import { Account, TransactionAccount } from './accounts';

export interface Transaction {
  id: number;
  identifier: string;

  toAccount?: Account;
  fromAccount?: Account;

  amount: number;
  message: string;

  createdAt?: string;
  updatedAt?: string;
}
