import { RegisterNuiCB } from '@project-error/pe-utils';
import {
  AccountEvents,
  ExternalAccountEvents,
  InvoiceEvents,
  SharedAccountEvents,
  TransactionEvents,
  UserEvents,
  BalanceEvents,
  Broadcasts,
  NUIEvents,
  CashEvents,
} from '@typings/Events';
import { Invoice } from '@typings/Invoice';
import { Transaction } from '@typings/Transaction';
import { RegisterNuiProxy } from 'cl_utils';
import API from './cl_api';
import config from './cl_config';

const useFrameworkIntegration = config.frameworkIntegration?.enabled;
let hasNUILoaded = false;

RegisterNuiCB(NUIEvents.Loaded, () => {
  console.debug('NUI has loaded.');
  hasNUILoaded = true;
});

RegisterNuiCB(NUIEvents.Unloaded, () => {
  console.debug('NUI has unloaded.');
  hasNUILoaded = false;
});

const waitForNUILoaded = (checkInterval = 250): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (hasNUILoaded) {
        resolve();
        clearInterval(interval);
      }
    }, checkInterval);
  });
};

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

RegisterCommand(
  'bank-force-load',
  async () => {
    console.debug('Waiting for NUI to load ..');
    await waitForNUILoaded();
    console.debug('Loaded. Emitting data to NUI.');
    SendNUIMessage({ type: UserEvents.Loaded, payload: true });
  },
  false,
);

onNet(UserEvents.Loaded, async () => {
  console.debug('Waiting for NUI to load ..');
  await waitForNUILoaded();
  console.debug('Loaded. Emitting data to NUI.');
  SendNUIMessage({ type: UserEvents.Loaded, payload: true });

  if (!useFrameworkIntegration) {
    StatSetInt(CASH_BAL_STAT, (await API.getMyCash()) ?? 0, true);
  }
});

onNet(UserEvents.Unloaded, () => {
  SendNUIMessage({ type: UserEvents.Unloaded });
});

const CASH_BAL_STAT = GetHashKey('MP0_WALLET_BALANCE');

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
RegisterNuiProxy(CashEvents.GetMyCash);
