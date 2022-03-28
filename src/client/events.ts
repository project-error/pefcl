import { TransactionEvents } from '@typings/Events';
import { Transaction } from '@typings/transactions';

onNet(TransactionEvents.NewTransactionBroadcast, (result: Transaction) => {
  console.log('Recieved a new transaction!');
  console.log(result);
});
