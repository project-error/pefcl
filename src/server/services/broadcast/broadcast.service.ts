import { singleton } from 'tsyringe';
import { Transaction } from '@typings/Transaction';
import { mainLogger } from '@server/sv_logger';
import { UserService } from '../user/user.service';
import { Broadcasts } from '@typings/Events';
import { TransactionDB } from '../transaction/transaction.db';
import { Account } from '@server/../../typings/Account';
import { Cash } from '@server/../../typings/Cash';

const logger = mainLogger.child({ module: 'broadcastService' });

@singleton()
export class BroadcastService {
  _transactionDB: TransactionDB;
  _userService: UserService;

  constructor(transactionDB: TransactionDB, userService: UserService) {
    this._transactionDB = transactionDB;
    this._userService = userService;
  }

  async broadcastTransaction(transaction: Transaction) {
    logger.silly(`Broadcasted transaction:`);
    logger.silly(JSON.stringify(transaction));

    const { ownerIdentifier: toIdentifier } = transaction.toAccount ?? {};
    const { ownerIdentifier: fromIdentifier } = transaction.fromAccount ?? {};

    const toUser = this._userService.getUserByIdentifier(toIdentifier ?? '');
    const fromUser = this._userService.getUserByIdentifier(fromIdentifier ?? '');

    const isUserSame = toUser?.getIdentifier() && fromUser?.getIdentifier();

    if (toUser && fromUser && isUserSame) {
      logger.silly(
        `(internal transfer) Broadcasting new internal transaction to src: ${toUser.getSource()}, identifier: ${toUser.getIdentifier()}`,
      );
      emitNet(Broadcasts.NewTransaction, toUser.getSource(), transaction);
      return;
    }

    if (toUser) {
      logger.silly(
        `(toAccount) Broadcasting new transaction to src: ${toUser.getSource()}, identifier: ${toUser.getIdentifier()}`,
      );
      emitNet(Broadcasts.NewTransaction, toUser.getSource(), transaction);
    }

    if (fromUser) {
      logger.silly(
        `(fromAccount) Broadcasting new transaction to src: ${fromUser.getSource()}, identifier: ${fromUser.getIdentifier()}`,
      );
      emitNet(Broadcasts.NewTransaction, fromUser.getSource(), transaction);
    }
  }

  async broadcastNewDefaultAccountBalance(account: Account) {
    /* Do not broadcast updated values for none default account */
    if (!account.isDefault) {
      return;
    }

    logger.silly('Broadcasting new balance for default account ..');

    const identifier = account.ownerIdentifier;
    const user = this._userService.getUserByIdentifier(identifier);

    if (!user) {
      /* User is probably offline */
      return;
    }

    const balance = account.balance;
    emitNet(Broadcasts.NewDefaultAccountBalance, user?.getSource(), balance);

    logger.silly('Broadcasted new balance for default account!');
    logger.silly({ identifier, source: user.getSource(), balance });
  }

  async broadcastNewCash(cash: Cash) {
    logger.silly('Broadcasting new cash amount ..');

    const identifier = cash.ownerIdentifier;
    const user = this._userService.getUserByIdentifier(identifier);

    if (!user) {
      /* User is probably offline */
      return;
    }

    const amount = cash.amount;
    emitNet(Broadcasts.NewCashAmount, user?.getSource(), amount);

    logger.silly('Broadcasted new cash amount!');
    logger.silly({ identifier, source: user.getSource(), amount });
  }
}
