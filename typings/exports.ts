/* Exports used with framework integrations */

export interface FrameworkIntegrationExports {
  /* User exports */
  getPlayerName(source: number): string;
  getPlayerIdentifier(source: number): string;

  /* Cash exports */
  getCash(source: number): number;
  addCash: (source: number, amount: number) => void;
  removeCash: (source: number, amount: number) => void;
}

export type FrameworkIntegrationFunction = keyof FrameworkIntegrationExports;
