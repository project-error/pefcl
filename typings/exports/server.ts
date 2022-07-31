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
  SetBankBalance = 'setBankBalance',
  SetBankBalanceByIdentifier = 'setBankBalanceByIdentifier',
  AddBankBalance = 'addBankBalance',
  AddBankBalanceByIdentifier = 'addBankBalanceByIdentifier',
  RemoveBankBalanceByIdentifier = 'removeBankBalanceByIdentifier',
  RemoveBankBalance = 'removeBankBalance',

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
