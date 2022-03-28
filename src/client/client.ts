import ClientUtils from './client-utils';
import './client-accounts';
import { GeneralEvents } from '@typings/Events';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { createInvoice, depositMoney, getCash, giveCash, withdrawMoney } from './commands';

let atmOpen = false;
let bankOpen = false;

RegisterCommand(
  'bank',
  () => {
    bankOpen = !bankOpen;
    SendNUIMessage({ type: 'setVisible', payload: bankOpen });

    if (bankOpen) {
      SetNuiFocus(true, true);
    } else {
      SetNuiFocus(false, false);
    }
  },
  false,
);

RegisterCommand(
  'bank-atm',
  () => {
    atmOpen = !atmOpen;
    SendNUIMessage({ type: 'setVisibleATM', payload: atmOpen });

    if (atmOpen) {
      SetNuiFocus(true, true);
    } else {
      SetNuiFocus(false, false);
    }
  },
  false,
);

RegisterCommand('cash', getCash, false);
RegisterCommand('giveCash', giveCash, false);
RegisterCommand('depositMoney', depositMoney, false);
RegisterCommand('withdrawMoney', withdrawMoney, false);
RegisterCommand('createInvoice', createInvoice, false);

RegisterNuiCB<void>(GeneralEvents.CloseUI, async () => {
  SendNUIMessage({ type: 'setVisible', payload: false });
  SendNUIMessage({ type: 'setVisibleATM', payload: false });
  bankOpen = false;
  atmOpen = false;
  SetNuiFocus(false, false);
});

export const ClUtils = new ClientUtils({ promiseTimeout: 2000 });
