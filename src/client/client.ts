import ClientUtils from './client-utils';
import './client-accounts';
import { GeneralEvents } from '../../typings/accounts';
import { RegisterNuiCB } from '@project-error/pe-utils';

let bankOpen = false;

RegisterCommand(
  'bank',
  () => {
    bankOpen = !bankOpen;
    // SendNUIMessage({ action: 'setVisible', data: bankOpen });
    SendNUIMessage({ type: 'setVisible', payload: bankOpen });

    if (bankOpen) {
      SetNuiFocus(true, true);
    } else {
      SetNuiFocus(false, false);
    }
  },
  false,
);

RegisterNuiCB<void>(GeneralEvents.CloseBank, async () => {
  bankOpen = false;
  SetNuiFocus(false, false);
});

export const ClUtils = new ClientUtils();
