import cl_config from 'cl_config';

const isBankBlipsEnabled = cl_config.bankBlips?.enabled ?? false;
const isAtmBlipsEnabled = cl_config.atmBlips?.enabled ?? false;

if (isBankBlipsEnabled) {
  const blipName = cl_config.bankBlips?.name ?? 'Bank';
  const blipColor = cl_config.bankBlips?.colour ?? 3;
  const blipIcon = cl_config.bankBlips?.icon ?? 4;
  const blipScale = cl_config.bankBlips?.scale ?? 1;
  const blipCoords = cl_config.bankBlips?.coords ?? [];
  const blipDisplayType = cl_config.bankBlips?.display ?? 4;
  const blipShortRange = cl_config.bankBlips?.shortRange ?? true;

  blipCoords.forEach((coord) => {
    if (!coord || !coord.x || !coord.y || !coord.z) {
      throw new Error('Missing blip coords. Check your "blips.coords" config.');
    }

    const blip = AddBlipForCoord(coord.x, coord.y, coord.z);
    SetBlipDisplay(blip, blipDisplayType);
    SetBlipSprite(blip, blipIcon);
    SetBlipScale(blip, blipScale);
    SetBlipColour(blip, blipColor);
    SetBlipAsShortRange(blip, blipShortRange);
    BeginTextCommandSetBlipName('STRING');
    AddTextComponentString(blipName);
    EndTextCommandSetBlipName(blip);
  });
}

if (isAtmBlipsEnabled) {
  const blipName = cl_config.atmBlips?.name ?? 'ATM';
  const blipColor = cl_config.atmBlips?.colour ?? 3;
  const blipIcon = cl_config.atmBlips?.icon ?? 4;
  const blipScale = cl_config.atmBlips?.scale ?? 1;
  const blipCoords = cl_config.atmBlips?.coords ?? [];
  const blipDisplayType = cl_config.atmBlips?.display ?? 4;
  const blipShortRange = cl_config.atmBlips?.shortRange ?? true;

  blipCoords.forEach((coord) => {
    if (!coord || !coord.x || !coord.y || !coord.z) {
      throw new Error('Missing blip coords. Check your "blips.coords" config.');
    }

    const blip = AddBlipForCoord(coord.x, coord.y, coord.z);
    SetBlipDisplay(blip, blipDisplayType);
    SetBlipSprite(blip, blipIcon);
    SetBlipScale(blip, blipScale);
    SetBlipColour(blip, blipColor);
    SetBlipAsShortRange(blip, blipShortRange);
    BeginTextCommandSetBlipName('STRING');
    AddTextComponentString(blipName);
    EndTextCommandSetBlipName(blip);
  });
}
