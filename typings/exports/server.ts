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
  GetTotalBankBalanceByIdentifier = 'getTotalBankBalanceByIdentifier',
  GetDefaultAccountBalance = 'getDefaultAccountBalance',
  GetBankBalanceByIdentifier = 'getBankBalanceByIdentifier',
  SetBankBalance = 'setBankBalance',
  SetBankBalanceByIdentifier = 'setBankBalanceByIdentifier',
  AddBankBalance = 'addBankBalance',
  AddBankBalanceByIdentifier = 'addBankBalanceByIdentifier',
  AddBankBalanceByNumber = 'addBankBalanceByNumber',
  RemoveBankBalance = 'removeBankBalance',
  RemoveBankBalanceByIdentifier = 'removeBankBalanceByIdentifier',
  RemoveBankBalanceByNumber = 'removeBankBalanceByNumber',

  PayInvoice = 'payInvoice',
  GetInvoices = 'getInvoices',
  CreateInvoice = 'createInvoice',
  GetUnpaidInvoices = 'getUnpaidInvoices',

  LoadPlayer = 'loadPlayer',
  UnloadPlayer = 'unloadPlayer',

  GetAccounts = 'getAccounts',
  GetAccountsByIdentifier = 'getAccountsByIdentifier',

  /* Can be utilised by jobs or similar */
  CreateUniqueAccount = 'createUniqueAccount',
  GetUniqueAccount = 'getUniqueAccount',
  AddUserToUniqueAccount = 'addUserToUniqueAccount',
  RemoveUserFromUniqueAccount = 'removeUserFromUniqueAccount',
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
