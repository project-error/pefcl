import { ServerPromiseResp } from '../http';

type ExportResponse = ServerPromiseResp<unknown>;
type ExportCallback = (result: ExportResponse) => void;

export enum ServerExports {
  AddCash = 'addCash',
  RemoveCash = 'removeCash',
  AddBankBalance = 'addBankBalance',
  RemoveBankBalance = 'removeBankBalance',
  WithdrawMoney = 'withdrawMoney',
  DepositMoney = 'depositMoney',
  CreateInvoice = 'createInvoice',
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
