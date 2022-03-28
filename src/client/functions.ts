import { BalanceErrors } from '@typings/Errors';
import { Api } from 'api';
import { getNearestPlayer, validateAmount } from 'client-utils';

const api = new Api();

export const giveCash = async (_source: number, args: string[]) => {
  const [amount] = args;

  const isValid = validateAmount(amount);
  if (!isValid) {
    console.log('Invalid amount');
    return;
  }

  const nearestPlayer = getNearestPlayer(5);
  if (!nearestPlayer) {
    console.log('No player nearby.');
    return;
  }

  await api.giveCash(nearestPlayer.source, Number(amount)).catch((error: Error) => {
    if (error.message === BalanceErrors.InsufficentFunds) {
      console.log('You are too poor');
      return;
    }

    console.log(error);
  });
};

export const getCash = async () => {
  const result = await api.getMyCash();
  console.log('Your cash is:', result);
};

export const createInvoice = async (_source: number, args: string[]) => {
  const [amount, message] = args;
  const isValid = validateAmount(amount);

  if (!isValid) {
    console.log('Invalid amount');
    return;
  }

  const nearestPlayer = getNearestPlayer(5);
  if (!nearestPlayer) {
    console.log('No player nearby.');
    return;
  }

  await api.createInvoice({
    amount: Number(amount),
    message,
    source: nearestPlayer.source,
  });
};

export const depositMoney = async (amount: number) => {
  const isValid = validateAmount(amount);

  if (!isValid) {
    console.log('Invalid amount');
    return;
  }

  return await api.depositMoney(Number(amount));
};

export const withdrawMoney = async (amount: number) => {
  const isValid = validateAmount(amount);

  if (!isValid) {
    console.log('Invalid amount');
    return;
  }

  return await api.withdrawMoney(Number(amount));
};
