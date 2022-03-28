import ClientUtils from './client-utils';
import './client-accounts';
import { GeneralEvents } from '@typings/Events';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { createInvoice, depositMoney, getCash, giveCash, withdrawMoney } from './commands';
import Config from './client-config';

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
    // Get position x amount units forward of the player or default to 5.0
    const plyPed = PlayerPedId();
    const [xp, yp, zp] = GetEntityCoords(plyPed, false);
    const [xf, yf, zf] = GetOffsetFromEntityInWorldCoords(
      plyPed,
      0.0,
      Config.atms?.distance ?? 5.0,
      0.0,
    );

    // Create a test capsule and get raycast result
    const tc = StartShapeTestCapsule(xp, yp, zp, xf, yf, zf, 0.5, 16, 0, 4);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [retval, hit, endCoords, surfaceNormal, entityHit] = GetRaycastResult(tc);
    if (!hit) return console.log('not hit');
    const model = GetEntityModel(entityHit);
    if (!Config.atms?.props?.includes(model)) return console.log('not atm');

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
