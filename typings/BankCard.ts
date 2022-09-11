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
  number: string;

  // Timestamps
  updatedAt?: string | number | Date;
  createdAt?: string | number | Date;
}

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
  pin: number;
}

export interface UpdateCardPinInput {
  cardId: number;
  newPin: number;
  oldPin: number;
}
