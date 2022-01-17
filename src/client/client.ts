import ClientUtils from './client-utils';
import './client-accounts';

let bankOpen = false;

RegisterCommand(
  'bank',
  () => {
    bankOpen = !bankOpen;
    console.log(bankOpen);
    SendNUIMessage({ action: 'setVisible', data: bankOpen });
    if (bankOpen) {
      SetNuiFocus(true, true);
    } else {
      SetNuiFocus(false, false);
    }
  },
  false,
);

export const ClUtils = new ClientUtils();
