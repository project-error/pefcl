import './i18n';
import './cl_events';
import './cl_exports';
import './cl_integrations';
import './cl_blips';
import { Broadcasts, GeneralEvents } from '@typings/Events';
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
  SendNUIMessage({ type: 'setVisible', payload: bool });
  SetNuiFocus(bool, bool);
};

export const setAtmIsOpen = (bool: boolean) => {
  if (isAtmOpen === bool) {
    return;
  }

  isAtmOpen = bool;
  SendNUIMessage({ type: 'setVisibleATM', payload: bool });
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
      SendNUIMessage({ type: 'setVisibleATM', payload: isAtmOpen });

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

const Delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

(async () => {
  while (GetResourceState('lb-phone') != 'started') {
    await Delay(10);
  }
  const lbPhone = global.exports['lb-phone'];

  lbPhone.RemoveCustomApp('pefcl');

  const response = lbPhone.AddCustomApp({
    identifier: 'pefcl',
    name: 'Banking',
    description: 'Manage your financials with Fleeca Banking',
    developer: 'Fleeca',
    defaultApp: false, // OPTIONAL if set to true, app should be added without having to download it,
    size: 59812, // OPTIONAL in kb
    // -- images = { "https://example.com/photo.jpg" }, -- OPTIONAL array of images for the app on the app store
    ui: GetCurrentResourceName() + '/web/dist/index.html#/mobile/dashboard', // -- this is the path to the HTML file
    icon: 'https://cfx-nui-' + GetCurrentResourceName() + '/web/dist/app-icon.png', // -- OPTIONAL app icon
    onUse: () => {
      const lbExports = global.exports['lb-phone'];
      console.log('pefl mobile app opened');
      lbExports.SendCustomAppMessage('pefcl', { type: Broadcasts.OpeningMobileApp, payload: true });
    },
  });

  console.log('lb phone response', response);
})();
