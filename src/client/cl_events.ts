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
import { Transaction } from '@typings/Transaction';
import { RegisterNuiProxy } from 'cl_utils';
import API from './cl_api';

onNet(Broadcasts.NewTransaction, (result: Transaction) => {
  SendNUIMessage({ type: Broadcasts.NewTransaction, payload: result });
});

onNet(Broadcasts.NewInvoice, (result: Invoice) => {
  SendNUIMessage({ type: Broadcasts.NewInvoice, payload: result });
});

onNet(Broadcasts.NewSharedUser, () => {
  SendNUIMessage({ type: Broadcasts.NewSharedUser });
});

onNet(Broadcasts.RemovedSharedUser, () => {
  SendNUIMessage({ type: Broadcasts.RemovedSharedUser });
});

onNet(UserEvents.Loaded, () => {
  // TODO: remove this temp fix
  // This is only issue on resource reload, wait for resource to be loaded, before playerLoad

  setTimeout(() => {
    SendNUIMessage({ type: UserEvents.Loaded });
  }, 2000);
});

onNet(UserEvents.Unloaded, () => {
  SendNUIMessage({ type: UserEvents.Unloaded });
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
RegisterNuiProxy(InvoiceEvents.CountUnpaid);
RegisterNuiProxy(InvoiceEvents.CreateInvoice);
RegisterNuiProxy(InvoiceEvents.PayInvoice);
RegisterNuiProxy(TransactionEvents.Get);
RegisterNuiProxy(TransactionEvents.GetHistory);
RegisterNuiProxy(TransactionEvents.CreateTransfer);

RegisterNuiProxy(UserEvents.GetUsers);
RegisterNuiProxy(SharedAccountEvents.AddUser);
RegisterNuiProxy(SharedAccountEvents.RemoveUser);
RegisterNuiProxy(SharedAccountEvents.GetUsers);
RegisterNuiProxy(ExternalAccountEvents.Add);
RegisterNuiProxy(ExternalAccountEvents.Get);

RegisterNuiProxy(AccountEvents.WithdrawMoney);
RegisterNuiProxy(AccountEvents.DepositMoney);
