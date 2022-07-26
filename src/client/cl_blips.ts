import cl_config from 'cl_config';

const isBlipsEnabled = cl_config.blips?.enabled ?? false;

if (isBlipsEnabled) {
  const blipName = cl_config.blips?.name ?? 'Bank';
  const blipColor = cl_config.blips?.color ?? 3;
  const blipIcon = cl_config.blips?.icon ?? 4;
  const blipScale = cl_config.blips?.scale ?? 1;
  const blipCoords = cl_config.blips?.coords ?? [];
  const blipDisplayType = cl_config.blips?.displayType ?? 4;
  const blipShortRange = cl_config.blips?.shortRange ?? true;

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
