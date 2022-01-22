export const getSource = (): number => global.source;

export const getGameLicense = (source: number) => {
  const identifiers = getPlayerIdentifiers(source);
  let playerIdentifier;

  for (const id of identifiers) {
    if (id.includes('license:')) {
      playerIdentifier = id;
    }
  }

  return playerIdentifier;
};
