import { Account, AccountType } from '../../../../../typings/accounts';
import { Transaction } from '../../../../../typings/transactions';

export const MockAccounts: Account[] = [
  {
    id: 'sdjafi8weyw',
    accountName: 'Default account',
    balance: '45.00',
    owner: true,
    isDefault: true,
    type: AccountType.Personal,
  },
  {
    id: 'iwfiw99e08fwe',
    accountName: 'Savings',
    balance: '9654.00',
    owner: true,
    isDefault: false,
    type: AccountType.Personal,
  },
  {
    id: '0iweif9i9wue',
    accountName: 'google_was_my_idea',
    balance: '0.00',
    owner: false,
    isDefault: false,
    type: AccountType.Shared,
  },
];

export const MockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'deposit',
    amount: '2342',
    date: '1642276186',
    target: 'Taso',
  },
  {
    id: 1,
    type: 'withdraw',
    amount: '93',
    date: '1642276186',
    target: 'Rocky',
  },
];
