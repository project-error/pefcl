import { RegisterNuiCB } from '@project-error/pe-utils';
import { Account } from '@typings/Account';
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
  CardEvents,
} from '@typings/Events';
import { Invoice } from '@typings/Invoice';
import { Transaction } from '@typings/Transaction';
import { OnlineUser } from '@typings/user';
import { RegisterNuiProxy } from 'cl_utils';
import API from './cl_api';
import config from './cl_config';

const npwdExports = global.exports['npwd'];

const useFrameworkIntegration = config.frameworkIntegration?.enabled;
let hasNUILoaded = false;

emitNet(UserEvents.LoadClient);

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

const SendBankUIMessage = (data: object) => {
  SendNUIMessage(data);

  if (GetResourceState('npwd') === 'started') {
    npwdExports.sendUIMessage(data);
  }
};

onNet(Broadcasts.NewAccount, (payload: Account) => {
  SendBankUIMessage({ type: Broadcasts.NewAccount, payload });
});

onNet(Broadcasts.NewAccountBalance, (balance: number) => {
  SendBankUIMessage({ type: Broadcasts.NewAccountBalance, payload: balance });
});

onNet(Broadcasts.NewTransaction, (payload: Transaction) => {
  SendBankUIMessage({ type: Broadcasts.NewTransaction, payload });
});

onNet(Broadcasts.UpdatedAccount, (payload: Account) => {
  SendBankUIMessage({ type: Broadcasts.UpdatedAccount, payload });
});

onNet(Broadcasts.NewInvoice, (payload: Invoice) => {
  SendBankUIMessage({ type: Broadcasts.NewInvoice, payload });
});

onNet(Broadcasts.NewSharedUser, () => {
  SendBankUIMessage({ type: Broadcasts.NewSharedUser });
});

onNet(Broadcasts.RemovedSharedUser, () => {
  SendBankUIMessage({ type: Broadcasts.RemovedSharedUser });
});

onNet(UserEvents.Loaded, async (user: OnlineUser) => {
  console.debug('Waiting for NUI to load ..');
  await waitForNUILoaded();
  console.debug('Loaded. Emitting data to NUI.');
  SendBankUIMessage({ type: UserEvents.Loaded, payload: JSON.stringify(user) });

  if (!useFrameworkIntegration) {
    StatSetInt(CASH_BAL_STAT, (await API.getMyCash()) ?? 0, true);
  }
});

onNet(UserEvents.Unloaded, () => {
  SendBankUIMessage({ type: UserEvents.Unloaded });
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

RegisterNuiProxy(AccountEvents.GetAtmAccount);
RegisterNuiProxy(AccountEvents.WithdrawMoney);
RegisterNuiProxy(AccountEvents.DepositMoney);
RegisterNuiProxy(CashEvents.GetMyCash);

// Cards
RegisterNuiProxy(CardEvents.Get);
RegisterNuiProxy(CardEvents.Block);
RegisterNuiProxy(CardEvents.Delete);
RegisterNuiProxy(CardEvents.OrderPersonal);
RegisterNuiProxy(CardEvents.OrderShared);
RegisterNuiProxy(CardEvents.UpdatePin);
RegisterNuiProxy(CardEvents.GetInventoryCards);

RegisterCommand(
  'bank-force-load',
  async () => {
    console.debug('Waiting for NUI to load ..');
    await waitForNUILoaded();
    console.debug('Loaded. Emitting data to NUI.');
    SendBankUIMessage({ type: UserEvents.Loaded, payload: true });
  },
  false,
);
