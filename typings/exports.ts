/* Exports used with framework integrations */

import { OnlineUser } from './user';

export interface FrameworkIntegrationExports {
  /* Cash exports */
  getCash(source: number): number;
  addCash: (source: number, amount: number) => void;
  removeCash: (source: number, amount: number) => void;
}

export type FrameworkIntegrationFunction = keyof FrameworkIntegrationExports;
