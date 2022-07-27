import { ServerPromiseResp } from '../http';

type ExportResponse = ServerPromiseResp<unknown>;
type ExportCallback = (result: ExportResponse) => void;

export enum ServerExports {
  GetCash = 'getCash',
  AddCash = 'addCash',
  RemoveCash = 'removeCash',
  DepositCash = 'depositCash',
  WithdrawCash = 'withdrawCash',

  GetTotalBankBalance = 'getTotalBankBalance',
  GetDefaultAccountBalance = 'getDefaultAccountBalance',
  AddBankBalance = 'addBankBalance',
  AddBankBalanceByIdentifier = 'addBankBalanceByIdentifier',
  RemoveBankBalance = 'removeBankBalance',
  RemoveBankBalanceByIdentifier = 'removeBankBalanceByIdentifier',

  GetInvoices = 'getInvoices',
  CreateInvoice = 'createInvoice',
  GetUnpaidInvoices = 'getUnpaidInvoices',

  LoadPlayer = 'loadPlayer',
  UnloadPlayer = 'unloadPlayer',

  GetAccounts = 'getAccounts',
  GetAccountsByIdentifier = 'getAccountsByIdentifier',
  CreateAccount = 'createAccount',
}

export type WithdrawMoneyExport = (
  source: number,
  amount: number,
  callback: ExportCallback,
) => Promise<ExportResponse>;

export type DepositMoneyExport = (
  source: number,
  amount: number,
  callback: ExportCallback,
) => Promise<ExportResponse>;
