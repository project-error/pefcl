import { setBankIsOpen, setAtmIsOpen } from 'client';
import cl_config from 'cl_config';
import { translations } from 'i18n';
const exp = global.exports;

const isTargetEnabled = cl_config.target?.enabled ?? false;
const targetType = cl_config.target?.type ?? 'qtarget';
const isTargetDebugEnabled = cl_config.target?.debug ?? false;
const isTargetAvailable = GetResourceState(targetType) === 'started';

if (isTargetEnabled && isTargetAvailable) {
  const bankZones = cl_config.target?.bankZones ?? [];
  const atmModels = cl_config.atms?.props ?? [];

  atmModels.forEach((model) => {
    exp[targetType]['AddTargetModel'](model, {
      options: [
        {
          event: 'pefcl:open:atm',
          icon: 'fas fa-money-bill-1-wave',
          label: 'ATM',
        },
      ],
    });
  });

  bankZones.forEach((zone, index) => {
    const name = 'bank_' + index;

    if (!zone) {
      throw new Error('Missing zone. Check your "qtarget.bankZones" config.');
    }

    exp[targetType]['AddBoxZone'](
      name,
      zone.position,
      zone.length,
      zone.width,
      {
        name,
        heading: zone.heading,
        debugPoly: isTargetDebugEnabled,
        minZ: zone.minZ,
        maxZ: zone.maxZ,
      },
      {
        options: [
          {
            event: 'pefcl:open:bank',
            icon: 'fas fa-building-columns',
            label: translations.t('Open bank'),
          },
        ],
        distance: 1.5,
      },
    );
  });

  AddEventHandler('pefcl:open:atm', () => {
    setAtmIsOpen(true);
  });

  AddEventHandler('pefcl:open:bank', () => {
    setBankIsOpen(true);
  });
}
