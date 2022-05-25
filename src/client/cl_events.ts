import {
  AccountEvents,
  ExternalAccountEvents,
  InvoiceEvents,
  SharedAccountEvents,
  TransactionEvents,
  UserEvents,
  BalanceEvents,
  Broadcasts,
} from '@typings/Events';
import { Invoice } from '@typings/Invoice';
import { Transaction } from '@typings/transactions';
import { OnlineUser } from '@typings/user';
import { RegisterNuiProxy } from 'cl_utils';
import API from './cl_api';

onNet(Broadcasts.NewTransaction, (result: Transaction) => {
  SendNUIMessage({ type: Broadcasts.NewTransaction, payload: result });
});

onNet(Broadcasts.NewInvoice, (result: Invoice) => {
  SendNUIMessage({ type: Broadcasts.NewInvoice, payload: result });
});

onNet(UserEvents.Loaded, (result: OnlineUser) => {
  SendNUIMessage({ type: UserEvents.Loaded, payload: result });
});

const CASH_BAL_STAT = GetHashKey('MP0_WALLET_BALANCE');

setImmediate(async () => {
  StatSetInt(CASH_BAL_STAT, (await API.getMyCash()) ?? 0, true);
});

onNet(BalanceEvents.UpdateCashBalance, (newBalance: number) => {
  StatSetInt(CASH_BAL_STAT, newBalance, true);
});

RegisterNuiProxy(AccountEvents.GetAccounts);
RegisterNuiProxy(AccountEvents.CreateAccount);
RegisterNuiProxy(AccountEvents.DeleteAccount);
RegisterNuiProxy(AccountEvents.SetDefaultAccount);
RegisterNuiProxy(AccountEvents.RenameAccount);
RegisterNuiProxy(InvoiceEvents.Get);
RegisterNuiProxy(InvoiceEvents.CreateInvoice);
RegisterNuiProxy(InvoiceEvents.PayInvoice);
RegisterNuiProxy(TransactionEvents.Get);
RegisterNuiProxy(TransactionEvents.CreateTransfer);

RegisterNuiProxy(UserEvents.GetUsers);
RegisterNuiProxy(SharedAccountEvents.AddUser);
RegisterNuiProxy(SharedAccountEvents.RemoveUser);
RegisterNuiProxy(SharedAccountEvents.GetUsers);
RegisterNuiProxy(ExternalAccountEvents.Add);
RegisterNuiProxy(ExternalAccountEvents.Get);

RegisterNuiProxy(AccountEvents.WithdrawMoney);
RegisterNuiProxy(AccountEvents.DepositMoney);
RegisterNuiProxy(TransactionEvents.GetHistory);
