import { Account } from '@server/../../typings/Account';
import { Card } from '@server/../../typings/BankCard';
import { Cash } from '@server/../../typings/Cash';
import { Transaction } from '@server/../../typings/Transaction';
import { Controller } from '@server/decorators/Controller';
import { Event, EventListener } from '@server/decorators/Event';
import { BroadcastService } from './broadcast.service';

import {
  AccountEvents,
  CardEvents,
  CashEvents,
  TransactionEvents,
} from '@server/../../typings/Events';

@Controller('Broadcast')
@EventListener()
export class BroadcastController {
  broadcastService: BroadcastService;
  constructor(broadcastService: BroadcastService) {
    this.broadcastService = broadcastService;
  }

  @Event(AccountEvents.NewBalance)
  async onNewBalance(account: Account) {
    this.broadcastService.broadcastNewDefaultAccountBalance(account);
  }

  @Event(AccountEvents.NewBalance)
  async onNewAccountBalance(account: Account) {
    this.broadcastService.broadcastNewAccountBalance(account);
  }

  @Event(AccountEvents.NewAccountCreated)
  async onNewAccountCreation(account: Account) {
    this.broadcastService.broadcastUpdatedAccount(account);
  }

  @Event(AccountEvents.AccountDeleted)
  async onAccountDeleted(account: Account) {
    this.broadcastService.broadcastUpdatedAccount(account);
  }

  @Event(CashEvents.NewCash)
  async onNewCash(cash: Cash) {
    this.broadcastService.broadcastNewCash(cash);
  }

  @Event(TransactionEvents.NewTransaction)
  async onNewTransaction(transaction: Transaction) {
    this.broadcastService.broadcastTransaction(transaction);
  }

  @Event(CardEvents.NewCard)
  async onNewCard(card: Card) {
    this.broadcastService.broadcastNewCard(card);
  }
}
