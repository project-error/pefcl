import { TransactionAccount } from './accounts';

export interface Transaction {
  id: number;
  amount: number;
  message: string;
  createdAt: string;
  to: TransactionAccount;
  from: TransactionAccount;
}
