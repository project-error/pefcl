import { setBankIsOpen, setAtmIsOpen } from 'client';
import { createInvoice, depositMoney, giveCash, withdrawMoney } from 'functions';

const exp = global.exports;

exp('openBank', async () => {
  setBankIsOpen(true);
});

exp('closeBank', async () => {
  setBankIsOpen(false);
});

exp('openAtm', async () => {
  setAtmIsOpen(true);
});

exp('closeAtm', async () => {
  setAtmIsOpen(false);
});

exp('giveNearestPlayerCash', (amount: number) => {
  giveCash(0, [amount.toString()]);
});

exp('createInvoiceForNearestPlayer', (amount: number, message: string) => {
  createInvoice(0, [amount.toString(), message]);
});

exp('depositMoney', (amount: number) => {
  depositMoney(amount);
});

exp('withdrawMoney', (amount: number) => {
  withdrawMoney(amount);
});
