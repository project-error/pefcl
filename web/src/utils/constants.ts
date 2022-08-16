import { Account, AccountRole, AccountType } from '@typings/Account';
import { GetTransactionsResponse, TransactionType } from '../../../typings/Transaction';
import { Invoice, InvoiceStatus } from '../../../typings/Invoice';
import dayjs from 'dayjs';

export const resourceDefaultName = 'pefcl';

const now = dayjs();

export const DEFAULT_PAGINATION_LIMIT = 5;
export const defaultWithdrawOptions = [500, 1000, 1500, 3000, 5000, 7500];

export const mockedAccounts: Account[] = [
  {
    id: 1,
    accountName: 'Savings',
    number: '920, 1000-2000-3000',
    balance: 4500,
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
  {
    id: 4,
    accountName: 'Bennys AB',
    number: '920, 1000-2000-3004',
    balance: 1800000,
    isDefault: false,
    ownerIdentifier: '',
    type: AccountType.Shared,
    role: AccountRole.Owner,
  },
  {
    id: 5,
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
    from: 'Repair shop',
    to: 'John doe',
    message: 'For the car mate',
    fromIdentifier: 'license:1',
    toIdentifier: 'license:2',
    createdAt: now.subtract(1, 'hour').unix().toString(),
    expiresAt: now.add(7, 'days').toString(),
    status: InvoiceStatus.PENDING,
  },
  {
    id: 2,
    amount: 2000,
    from: 'Repair shop',
    to: 'John doe',
    message: 'Repairs',
    fromIdentifier: 'license:1',
    toIdentifier: 'license:2',
    createdAt: now.subtract(4, 'hour').unix().toString(),
    expiresAt: now.add(3, 'days').toString(),
    status: InvoiceStatus.PENDING,
  },
  {
    id: 2,
    amount: 2000,
    from: 'Repair shop',
    to: 'John doe',
    message: 'Repairs',
    fromIdentifier: 'license:1',
    toIdentifier: 'license:2',
    createdAt: now.subtract(21, 'days').unix().toString(),
    expiresAt: now.subtract(7, 'days').toString(),
    status: InvoiceStatus.PAID,
  },
];
