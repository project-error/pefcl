/* Exports used with framework integrations */

import { Card, InventoryCard } from './BankCard';

export interface FrameworkIntegrationExports {
  /* Cash exports */
  getCash(source: number): number;
  addCash: (source: number, amount: number) => void;
  removeCash: (source: number, amount: number) => void;
  /**
   *
   *  Move the bank balance from existing bank upon initial account creation.
   *  The point is to move balance from framework to PEFCL, as an initial solution.
   *
   *  This export should probably remove old bank balance as well.
   */
  getBank: (source: number) => number;
  giveCard: (source: number, card: Card) => void;
  getCards: (source: number) => InventoryCard[];
}

export type FrameworkIntegrationFunction = keyof FrameworkIntegrationExports;
