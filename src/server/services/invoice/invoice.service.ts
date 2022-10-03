import { singleton } from 'tsyringe';
import { Request } from '../../../../typings/http';
import {
  CreateInvoiceInput,
  GetInvoicesInput,
  InvoiceStatus,
  PayInvoiceInput,
} from '../../../../typings/Invoice';
import { sequelize } from '../../utils/pool';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { AccountDB } from '../account/account.db';
import { TransactionDB } from '../transaction/transaction.db';
import { InvoiceDB } from './invoice.db';
import i18n from '@utils/i18n';
import { TransactionType } from '@typings/Transaction';
import { ServerError } from '@utils/errors';
import { AccountErrors, BalanceErrors, GenericErrors } from '@typings/Errors';
import { TransactionService } from '../transaction/transaction.service';
import { Broadcasts } from '@server/../../typings/Events';

const logger = mainLogger.child({ module: 'invoice-service' });

@singleton()
export class InvoiceService {
  _accountDB: AccountDB;
  _invoiceDB: InvoiceDB;
  _transactionDB: TransactionDB;
  _userService: UserService;
  transactionService: TransactionService;

  constructor(
    userService: UserService,
    invoiceDB: InvoiceDB,
    accountDB: AccountDB,
    transactionDB: TransactionDB,
    transactionService: TransactionService,
  ) {
    this._userService = userService;
    this._invoiceDB = invoiceDB;
    this._accountDB = accountDB;
    this._transactionDB = transactionDB;
    this.transactionService = transactionService;
  }

  async countUnpaidInvoices(source: number) {
    const user = this._userService.getUser(source);
    const total = await this._invoiceDB.getUnpaidInvoicesCount(user.getIdentifier());
    return total;
  }

  async countTotalInvoices(source: number) {
    const user = this._userService.getUser(source);
    const total = await this._invoiceDB.getReceivedInvoicesCount(user.getIdentifier());
    return total;
  }

  async getAllInvoicesBySource(req: Request<GetInvoicesInput>) {
    logger.silly('Fetching user invoices ..');
    const user = this._userService.getUser(req.source);
    const invoices = await this._invoiceDB.getAllReceivingInvoices(user.getIdentifier(), req.data);
    const total = await this.countTotalInvoices(req.source);
    const totalUnpaid = await this.countUnpaidInvoices(req.source);

    return {
      total,
      totalUnpaid: totalUnpaid,
      invoices: invoices.map((invoice) => invoice.toJSON()),
    };
  }

  async createInvoice(data: CreateInvoiceInput) {
    logger.silly('Creating invoice ..');
    logger.silly(data);

    const invoice = await this._invoiceDB.createInvoice(data);
    logger.silly('Created invoice.');

    const toUser = this._userService.getUserByIdentifier(data.toIdentifier);
    const fromUser = this._userService.getUserByIdentifier(data.fromIdentifier);

    toUser && emitNet(Broadcasts.NewInvoice, toUser.getSource(), invoice);
    fromUser && emitNet(Broadcasts.NewInvoice, fromUser.getSource(), invoice);

    return invoice;
  }

  async payInvoice(req: Request<PayInvoiceInput>) {
    logger.silly('Paying invoice.');
    logger.silly(req);

    const t = await sequelize.transaction();
    try {
      const fromAccount = await this._accountDB.getAccountById(req.data.fromAccountId, t);
      const invoice = await this._invoiceDB.getInvoiceById(req.data.invoiceId, t);

      /* Should we insert money to a specific account? */
      const receiverAccountIdentifier = invoice?.getDataValue('receiverAccountIdentifier');
      const toAccountIdentifier = invoice?.getDataValue('fromIdentifier');

      const toAccount = receiverAccountIdentifier
        ? await this._accountDB.getUniqueAccountByIdentifier(receiverAccountIdentifier, t)
        : await this._accountDB.getDefaultAccountByIdentifier(toAccountIdentifier ?? '', t);

      if (invoice?.getDataValue('status') === InvoiceStatus.PAID) {
        throw new ServerError('This invoice is already paid. Tell author of resource to fix UI');
      }

      if (!invoice || !fromAccount || !toAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (fromAccount.getDataValue('id') === toAccount.getDataValue('id')) {
        throw new ServerError(AccountErrors.SameAccount);
      }

      const accountBalance = fromAccount.getDataValue('balance');
      const amount = invoice.getDataValue('amount');

      if (accountBalance < amount) {
        throw new Error(BalanceErrors.InsufficentFunds);
      }

      /* TODO: Implement transaction fee if wanted */
      await this._accountDB.transfer({
        amount,
        fromAccount,
        toAccount,
        transaction: t,
      });
      await this._invoiceDB.payInvoice(req.data.invoiceId);

      await this.transactionService.handleCreateTransaction(
        {
          amount: amount,
          message: i18n.t('Paid outgoing invoice to: {{to}}', {
            to: invoice.getDataValue('to'),
          }),
          fromAccount: fromAccount.toJSON(),
          toAccount: toAccount.toJSON(),
          type: TransactionType.Outgoing,
        },
        t,
      );

      await this.transactionService.handleCreateTransaction(
        {
          amount: amount,
          message: i18n.t('Received incoming invoice from: {{from}}', {
            from: invoice.getDataValue('from'),
          }),
          fromAccount: fromAccount.toJSON(),
          toAccount: toAccount.toJSON(),
          type: TransactionType.Incoming,
        },
        t,
      );

      t.commit();
    } catch (err) {
      t.rollback();
      logger.error(err);
    }
  }
}
