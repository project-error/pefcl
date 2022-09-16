import { singleton } from 'tsyringe';
import { Transaction } from '@typings/Transaction';
import { mainLogger } from '@server/sv_logger';
import { UserService } from '../user/user.service';
import { Broadcasts } from '@typings/Events';
import { TransactionDB } from '../transaction/transaction.db';
import { Account, AccountType } from '@server/../../typings/Account';
import { Cash } from '@server/../../typings/Cash';
import { AccountService } from '../account/account.service';

const logger = mainLogger.child({ module: 'broadcastService' });

@singleton()
export class BroadcastService {
  _transactionDB: TransactionDB;
  _userService: UserService;
  _accountService: AccountService;

  constructor(
    transactionDB: TransactionDB,
    userService: UserService,
    accountService: AccountService,
  ) {
    this._transactionDB = transactionDB;
    this._userService = userService;
    this._accountService = accountService;
  }

  async broadcastUpdatedAccount(account: Account) {
    logger.silly(`Broadcasted updated account:`);
    logger.silly(JSON.stringify(account));

    const user = this._userService.getUserByIdentifier(account.ownerIdentifier);
    if (!user) return;

    emitNet(Broadcasts.UpdatedAccount, user?.getSource(), account);
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

  async broadcastNewAccountBalance(account: Account) {
    logger.silly('Broadcasting new balance for account ..');

    const isShared = account.type === AccountType.Shared;
    const identifier = account.ownerIdentifier;
    const user = this._userService.getUserByIdentifier(identifier);
    const onlineUsers = this._userService.getAllUsers();

    if (isShared) {
      const users = await this._accountService.getUsersFromShared({
        data: { accountId: account.id },
        source: 0,
      });

      const identifiers = users.map((user) => user.userIdentifier);

      onlineUsers.forEach((user) => {
        if (!identifiers.includes(user.getIdentifier())) {
          return;
        }

        emitNet(Broadcasts.NewAccountBalance, user.getSource(), account);

        logger.silly('Broadcasted new balance for shared account:');
        logger.silly({ identifier, source: user.getSource(), balance: account.balance });
      });
      return;
    }

    if (!user) {
      /* User is probably offline */
      return;
    }

    emitNet(Broadcasts.NewAccountBalance, user?.getSource(), account);

    logger.silly('Broadcasted new balance for personal account:');
    logger.silly({ identifier, source: user.getSource(), balance: account.balance });
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
