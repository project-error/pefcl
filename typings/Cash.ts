export interface Cash {
  id: number;
  amount: number;
  ownerIdentifier: string;
}

export interface ChangeCashInput {
  source: number;
  amount: number;
}
