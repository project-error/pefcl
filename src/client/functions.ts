import { BalanceErrors } from '@typings/Errors';
import API from 'cl_api';
import { getNearestPlayer, validateAmount } from 'cl_utils';

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

  await API.giveCash(nearestPlayer.source, Number(amount)).catch((error: Error) => {
    if (error.message === BalanceErrors.InsufficentFunds) {
      console.log('You are too poor');
      return;
    }

    console.log(error);
  });
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

  await API.createInvoice({
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

  return await API.depositMoney(Number(amount));
};

export const withdrawMoney = async (amount: number) => {
  const isValid = validateAmount(amount);

  if (!isValid) {
    console.log('Invalid amount');
    return;
  }

  return await API.withdrawMoney(Number(amount));
};
