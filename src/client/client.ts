import ClientUtils from './client-utils';
import './client-accounts';
import { GeneralEvents } from '@typings/Events';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { createInvoice, depositMoney, getCash, giveCash, withdrawMoney } from './commands';

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

RegisterCommand('cash', getCash, false);
RegisterCommand('giveCash', giveCash, false);
RegisterCommand('depositMoney', depositMoney, false);
RegisterCommand('withdrawMoney', withdrawMoney, false);
RegisterCommand('createInvoice', createInvoice, false);
RegisterKeyMapping('bank', 'Toggle Bank', 'keyboard', 'b');

RegisterNuiCB<void>(GeneralEvents.CloseBank, async () => {
  SendNUIMessage({ type: 'setVisible', payload: false });
  bankOpen = false;
  SetNuiFocus(false, false);
});

export const ClUtils = new ClientUtils({ promiseTimeout: 2000 });
