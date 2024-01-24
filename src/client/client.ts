import './i18n';
import './cl_events';
import './cl_exports';
import './cl_integrations';
import './cl_blips';
import { GeneralEvents } from '@typings/Events';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { createInvoice, giveCash } from './functions';
import config from './cl_config';

let isAtmOpen = false;
let isBankOpen = false;
const useFrameworkIntegration = config.frameworkIntegration?.enabled;

export const setBankIsOpen = (bool: boolean) => {
  if (isBankOpen === bool) {
    return;
  }

  isBankOpen = bool;
  SendNUIMessage({ app: 'PEFCL', method: 'setVisible', data: bool });

  console.log('setBankIsOpen', bool);

  SetNuiFocus(bool, bool);
};

export const setAtmIsOpen = (bool: boolean) => {
  if (isAtmOpen === bool) {
    return;
  }

  isAtmOpen = bool;
  SendNUIMessage({ app: 'PEFCL', method: 'setVisibleATM', data: bool });
  SetNuiFocus(bool, bool);
};

if (!useFrameworkIntegration) {
  RegisterCommand(
    'bank',
    () => {
      setBankIsOpen(!isBankOpen);
    },
    false,
  );

  RegisterCommand(
    'atm',
    () => {
      // Get position x amount units forward of the player or default to 5.0
      const plyPed = PlayerPedId();
      const [xp, yp, zp] = GetEntityCoords(plyPed, false);
      const [xf, yf, zf] = GetOffsetFromEntityInWorldCoords(
        plyPed,
        0.0,
        config.atms?.distance ?? 5.0,
        0.0,
      );

      // Create a test capsule and get raycast result
      const tc = StartShapeTestCapsule(xp, yp, zp, xf, yf, zf, 0.5, 16, 0, 4);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [retval, hit, endCoords, surfaceNormal, entityHit] = GetRaycastResult(tc);
      if (!hit) return console.log('not hit');
      const model = GetEntityModel(entityHit);
      if (!config.atms?.props?.includes(model)) return console.log('not atm');

      isAtmOpen = !isAtmOpen;
      SendNUIMessage({ app: 'PEFCL', method: 'setVisibleATM', data: isAtmOpen });

      if (isAtmOpen) {
        SetNuiFocus(true, true);
      } else {
        SetNuiFocus(false, false);
      }
    },
    false,
  );
}

RegisterNuiCB<void>(GeneralEvents.CloseUI, async () => {
  setBankIsOpen(false);
  setAtmIsOpen(false);

  emit('pefcl:closedUI');
});

if (!useFrameworkIntegration) {
  RegisterCommand(
    'cash',
    async () => {
      SetMultiplayerWalletCash();
      setTimeout(RemoveMultiplayerWalletCash, 5000);
    },
    false,
  );
}

if (!useFrameworkIntegration) {
  RegisterCommand('giveCash', giveCash, false);
  RegisterCommand('createInvoice', createInvoice, false);
}
