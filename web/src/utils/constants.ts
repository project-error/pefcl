import { Account, AccountRole, AccountType } from '@typings/Account';
import {
  GetTransactionsResponse,
  Transaction,
  TransactionType,
} from '../../../typings/transactions';
import { Invoice, InvoiceStatus } from '../../../typings/Invoice';
import dayjs from 'dayjs';

export const resourceDefaultName = 'pe-financial';

const now = dayjs();

export const mockedAccounts: Account[] = [
  {
    id: 1,
    accountName: 'Savings',
    number: '920, 1000-2000-3000',
    balance: 20000,
    isDefault: true,
    ownerIdentifier: '',
    type: AccountType.Personal,
    role: AccountRole.Owner,
  },
  {
    id: 2,
    accountName: 'Pension',
    number: '920, 1000-2000-3002',
    balance: 20000,
    isDefault: false,
    ownerIdentifier: '',
    type: AccountType.Personal,
    role: AccountRole.Owner,
  },
  {
    id: 3,
    accountName: 'Bennys AB',
    number: '920, 1000-2000-3004',
    balance: 1800000,
    isDefault: false,
    ownerIdentifier: '',
    type: AccountType.Shared,
    role: AccountRole.Owner,
  },
];

export const mockedTransactions: GetTransactionsResponse = {
  limit: 25,
  offset: 0,
  total: 2,
  transactions: [
    {
      id: 1,
      amount: 280,
      type: TransactionType.Transfer,
      message: 'For the last time, give me the money',
      createdAt: '1642276186',
      fromAccount: mockedAccounts[0],
      toAccount: mockedAccounts[1],
    },
    {
      id: 1,
      amount: 8000000,
      message: 'For the last time, give me the money',
      createdAt: '1642276186',
      type: TransactionType.Transfer,
      fromAccount: mockedAccounts[0],
      toAccount: mockedAccounts[1],
    },
  ],
};

export const mockedInvoices: Invoice[] = [
  {
    id: 1,
    amount: 8000,
    message: 'For the car mate',
    from: 'Cardealer',
    to: 'You',
    createdAt: now.subtract(1, 'hour').unix().toString(),
    expiresAt: now.add(7, 'days').unix().toString(),
    status: InvoiceStatus.PENDING,
  },
  {
    id: 2,
    amount: 2000,
    message: 'Repairs',
    from: 'Bennys AB',
    to: 'You',
    createdAt: now.subtract(4, 'hour').unix().toString(),
    expiresAt: now.add(3, 'days').unix().toString(),
    status: InvoiceStatus.PENDING,
  },
  {
    id: 2,
    amount: 2000,
    message: 'Repairs',
    from: 'Bennys AB',
    to: 'You',
    createdAt: now.subtract(21, 'days').unix().toString(),
    expiresAt: now.subtract(7, 'days').unix().toString(),
    status: InvoiceStatus.PAID,
  },
];
