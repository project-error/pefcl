import { singleton } from 'tsyringe';
import { Request } from '../../../../typings/http';
import { CreateInvoiceInput, PayInvoiceInput } from '../../../../typings/Invoice';
import { sequelize } from '../../utils/pool';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { AccountDB } from '../account/account.db';
import { TransactionDB } from '../transaction/transaction.db';
import { InvoiceDB } from './invoice.db';
import i18n from '@utils/i18n';
import { TransactionType } from '@typings/transactions';
import { ServerError } from '@utils/errors';
import { AccountErrors, GenericErrors } from '@typings/Errors';
import { TransactionService } from '../transaction/transaction.service';

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

  async getAllInvoicesBySource(source: number) {
    logger.silly('Fetching user invoices!');
    const user = this._userService.getUser(source);
    const invoices = await this._invoiceDB.getAllReceivingInvoices(user.getIdentifier());
    return invoices;
  }

  async createInvoice(data: CreateInvoiceInput) {
    logger.silly('Creating invoice ..');
    logger.silly(data);

    const invoice = await this._invoiceDB.createInvoice(data);
    logger.silly('Created invoice.');
    return invoice;
  }

  async payInvoice(req: Request<PayInvoiceInput>) {
    logger.silly('Paying invoice.');
    logger.silly(req);

    const t = await sequelize.transaction();
    try {
      const fromAccount = await this._accountDB.getAccountById(req.data.fromAccountId);
      const invoice = await this._invoiceDB.getInvoiceById(req.data.invoiceId);
      const toAccountIdentifier = invoice?.getDataValue('fromIdentifier');
      const toAccount = await this._accountDB.getDefaultAccountByIdentifier(
        toAccountIdentifier ?? '',
      );

      if (!invoice || !fromAccount || !toAccount) {
        throw new ServerError(GenericErrors.NotFound);
      }

      if (fromAccount.getDataValue('id') === toAccount.getDataValue('id')) {
        throw new ServerError(AccountErrors.SameAccount);
      }

      const accountBalance = fromAccount.getDataValue('balance');
      const invoiceAmount = invoice.getDataValue('amount');

      if (accountBalance < invoiceAmount) {
        throw new Error('Insufficent funds');
      }

      /* TODO: Implement transaction fee if wanted */
      await toAccount.increment('balance', { by: invoiceAmount, transaction: t });
      await fromAccount.decrement('balance', { by: invoiceAmount, transaction: t });
      await this._invoiceDB.payInvoice(req.data.invoiceId);

      await this.transactionService.handleCreateTransaction(
        {
          amount: invoiceAmount,
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
          amount: invoiceAmount,
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
      console.log('Rolling back');
      t.rollback();
      logger.error(err);
    }
  }
}
