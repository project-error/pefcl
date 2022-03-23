export interface Cash {
  id: number;
  amount: number;
  ownerIdentifier: string;
}

export interface GiveCashInput {
  source: number;
  amount: number;
}
