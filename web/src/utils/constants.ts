import { Account, AccountType } from '@typings/Account';
import { Transaction } from '../../../typings/transactions';
import { Invoice, InvoiceStatus } from '../../../typings/Invoice';
import dayjs from 'dayjs';

export const resourceDefaultName = 'pe-financial';

const now = dayjs();

export const mockedAccounts: Account[] = [
  {
    id: 1,
    accountName: 'Savings',
    identifier: '',
    balance: 20000,
    isDefault: true,
    ownerIdentifier: '',
    type: AccountType.Personal,
  },
  {
    id: 2,
    identifier: '',
    accountName: 'Savings',
    balance: 20000,
    isDefault: false,
    ownerIdentifier: '',
    type: AccountType.Personal,
  },
  {
    id: 3,
    accountName: 'Bennys',
    identifier: '',
    balance: 1800000,
    isDefault: false,
    ownerIdentifier: '',
    type: AccountType.Shared,
  },
];

export const mockedTransactions: Transaction[] = [
  {
    id: 1,
    identifier: '',
    amount: 280,
    message: 'For the last time, give me the money',
    createdAt: '1642276186',
    fromAccount: {
      id: 1,
      accountName: 'Bosse',
      balance: 0,
      identifier: '',
      isDefault: false,
      ownerIdentifier: '',
      type: AccountType.Personal,
    },
    toAccount: {
      id: 2,
      accountName: 'Savings',
      balance: 0,
      identifier: '',
      isDefault: false,
      ownerIdentifier: '',
      type: AccountType.Personal,
    },
  },
  {
    id: 1,
    identifier: '',
    amount: 8000000,
    message: 'For the last time, give me the money',
    createdAt: '1642276186',
    fromAccount: {
      id: 1,
      accountName: 'Bosse',
      balance: 0,
      identifier: '',
      isDefault: false,
      ownerIdentifier: '',
      type: AccountType.Personal,
    },
    toAccount: {
      id: 2,
      accountName: 'Savings',
      balance: 0,
      identifier: '',
      isDefault: false,
      ownerIdentifier: '',
      type: AccountType.Personal,
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
