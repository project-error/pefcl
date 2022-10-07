import { Account } from './Account';

export interface Card {
  // Dynamic
  id: number;
  account?: Account;
  accountId?: number;

  pin: number;
  isBlocked: boolean;

  // Static
  holder: string;
  holderCitizenId: string;
  number: string;

  // Timestamps
  updatedAt?: string | number | Date;
  createdAt?: string | number | Date;
}

export type InventoryCard = Pick<Card, 'holder' | 'number' | 'accountId' | 'id'>;

export interface GetCardInput {
  accountId: number;
}
export interface CreateCardInput {
  pin: number;
  accountId: number;
  paymentAccountId: number;
}

export interface BlockCardInput {
  cardId: number;
}

export type DeleteCardInput = BlockCardInput;

export interface UpdateCardPinInput {
  cardId: number;
  newPin: number;
}
