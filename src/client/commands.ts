import { BalanceErrors } from '@typings/Errors';
import { Api } from 'api';
import { getNearestPlayer, validateAmount } from 'client-utils';

const api = new Api();

export const giveCash = async (source: number, args: string[]) => {
  const [amount] = args;

  console.log({ amount });

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

  console.log(`Giving ${amount} to ${nearestPlayer.source}`);

  await api.giveCash(nearestPlayer.source, Number(amount)).catch((error: Error) => {
    if (error.message === BalanceErrors.InsufficentFunds) {
      console.log('You too poor');
      return;
    }

    console.log(error);
  });
};

export const getCash = async () => {
  const result = await api.getMyCash();
  console.log('Your cash is:', result);
};

export const createInvoice = async (source: number, args: string[]) => {
  const [amount, message] = args;
  console.log({ message, amount });
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

  const result = await api.createInvoice({
    amount: Number(amount),
    message,
    source: nearestPlayer.source,
  });

  console.log({ result });
};

export const depositMoney = async (source: number, args: string[]) => {
  const [amount] = args;
  const isValid = validateAmount(amount);

  if (!isValid) {
    console.log('Invalid amount');
    return;
  }

  const result = await api.depositMoney(Number(amount));
  console.log({ result });
};

export const withdrawMoney = async (source: number, args: string[]) => {
  const [amount] = args;
  const isValid = validateAmount(amount);

  if (!isValid) {
    console.log('Invalid amount');
    return;
  }

  const result = await api.withdrawMoney(Number(amount));
  console.log({ result });
};
