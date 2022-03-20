export interface AccountServiceExports {
  getCurrentBalance(source: number): number;
  getCurrentBankBalance(source: number): number;
  pefclDepositMoney: (source: number, amount: number) => void;
  pefclWithdrawMoney: (source: number, amount: number) => void;
}
