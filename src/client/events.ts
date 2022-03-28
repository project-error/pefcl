import { TransactionEvents } from '@typings/Events';
import { Transaction } from '@typings/transactions';

onNet(TransactionEvents.NewTransactionBroadcast, (result: Transaction) => {
  SendNUIMessage({ type: TransactionEvents.NewTransactionBroadcast, payload: true });
});
