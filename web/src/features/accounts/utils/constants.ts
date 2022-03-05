import { Account, AccountType } from '../../../../../typings/accounts';
import { Transaction } from '../../../../../typings/transactions';
import { Invoice, InvoiceStatus } from '../../../../../typings/Invoice';
import dayjs from 'dayjs';

export const resourceDefaultName = 'pe-financial';

const now = dayjs();

export const mockedAccounts: Account[] = [
  {
    id: 1,
    accountName: 'Savings',
    isOwner: true,
    balance: 20000,
    isDefault: true,
    owner: 'Charles Carlsberg',
    type: AccountType.Personal,
  },
  {
    id: 2,
    accountName: 'Savings',
    isOwner: true,
    balance: 20000,
    isDefault: false,
    owner: 'Charles Carlsberg',
    type: AccountType.Personal,
  },
  {
    id: 3,
    accountName: 'Bennys',
    isOwner: true,
    balance: 1800000,
    isDefault: false,
    owner: 'Bennys AB',
    type: AccountType.Shared,
  },
];

export const mockedTransactions: Transaction[] = [
  {
    id: 1,
    amount: 280,
    message: 'For the last time, give me the money',
    createdAt: '1642276186',
    from: {
      id: 1,
      accountName: 'Bosse',
    },
    to: {
      id: 2,
      accountName: 'Savings',
    },
  },
  {
    id: 1,
    amount: 8000000,
    message: 'For the last time, give me the money',
    createdAt: '1642276186',
    from: {
      id: 1,
      accountName: 'Bosse',
    },
    to: {
      id: 2,
      accountName: 'Savings',
    },
  },
];

export const mockedInvoices: Invoice[] = [
  {
    id: 1,
    amount: 8000,
    message: 'For the car mate',
    from: 'Cardealer',
    createdAt: now.subtract(1, 'hour').unix().toString(),
    expiresAt: now.add(7, 'days').unix().toString(),
    status: InvoiceStatus.PENDING,
  },
  {
    id: 2,
    amount: 2000,
    message: 'Repairs',
    from: 'Bennys AB',
    createdAt: now.subtract(4, 'hour').unix().toString(),
    expiresAt: now.add(3, 'days').unix().toString(),
    status: InvoiceStatus.PENDING,
  },
  {
    id: 2,
    amount: 2000,
    message: 'Repairs',
    from: 'Bennys AB',
    createdAt: now.subtract(21, 'days').unix().toString(),
    expiresAt: now.subtract(7, 'days').unix().toString(),
    status: InvoiceStatus.PAID,
  },
];
