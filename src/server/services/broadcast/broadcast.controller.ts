import { AccountEvents, CashEvents, TransactionEvents } from '@server/../../typings/Events';
import { Transaction } from '@server/../../typings/Transaction';
import { Controller } from '@server/decorators/Controller';
import { Event, EventListener } from '@server/decorators/Event';
import { AccountModel } from '../account/account.model';
import { CashModel } from '../cash/cash.model';
import { BroadcastService } from './broadcast.service';

@Controller('Broadcast')
@EventListener()
export class BroadcastController {
  broadcastService: BroadcastService;
  constructor(broadcastService: BroadcastService) {
    this.broadcastService = broadcastService;
  }

  @Event(AccountEvents.NewBalance)
  async onNewBalance(account: AccountModel) {
    this.broadcastService.broadcastNewDefaultAccountBalance(account);
  }

  @Event(CashEvents.NewCash)
  async onNewCash(cash: CashModel) {
    this.broadcastService.broadcastNewCash(cash);
  }

  @Event(TransactionEvents.NewTransaction)
  async onNewTransaction(transaction: Transaction) {
    this.broadcastService.broadcastTransaction(transaction);
  }
}
