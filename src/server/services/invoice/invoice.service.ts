import { singleton } from 'tsyringe';
import { Request } from '../../../../typings/http';
import { InvoiceInput, PayInvoiceInput } from '../../../../typings/Invoice';
import { sequelize } from '../../utils/pool';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { AccountDB } from '../account/account.db';
import { TransactionDB } from '../transaction/transaction.db';
import { InvoiceDB } from './invoice.db';
import i18n from '@utils/i18n';
import { TransactionType } from '@typings/transactions';
import { ServerError } from '@utils/errors';
import { GenericErrors } from '@typings/Errors';

const logger = mainLogger.child({ module: 'invoice-service' });

@singleton()
export class InvoiceService {
  _accountDB: AccountDB;
  _invoiceDB: InvoiceDB;
  _transactionDB: TransactionDB;
  _userService: UserService;

  constructor(
    userService: UserService,
    invoiceDB: InvoiceDB,
    accountDB: AccountDB,
    transactionDB: TransactionDB,
  ) {
    this._userService = userService;
    this._invoiceDB = invoiceDB;
    this._accountDB = accountDB;
    this._transactionDB = transactionDB;
  }

  async getAllInvoicesBySource(source: number) {
    logger.silly('Fetching user invoices!');
    const user = this._userService.getUser(source);
    const invoices = await this._invoiceDB.getAllReceivingInvoices(user.getIdentifier());
    return invoices.map((invoice) => ({
      ...invoice.toJSON(),
      // TODO: Use Timestamps as saving type instead for dates. Dates currently get fucked on events SERVER > CLIENT.
      expiresAt: new Date(invoice.getDataValue('expiresAt') ?? '').toDateString(),
      createdAt: new Date(invoice.getDataValue('createdAt') ?? '').toDateString(),
    }));
  }

  async createInvoice(data: InvoiceInput) {
    logger.silly('Creating invoice.');
    logger.silly(data);

    const invoice = await this._invoiceDB.createInvoice(data);
    return invoice;
  }

  async payInvoice(req: Request<PayInvoiceInput>) {
    logger.silly('Paying invoice.');
    logger.silly(req);

    const t = await sequelize.transaction();
    try {
      const account = await this._accountDB.getAccountById(req.data.fromAccountId);
      const invoice = await this._invoiceDB.getInvoiceById(req.data.invoiceId);

      if (!invoice || !account) {
        throw new ServerError(GenericErrors.NotFound);
      }

      const accountBalance = account.getDataValue('balance');
      const invoiceAmount = invoice.getDataValue('amount');
      if (accountBalance < invoiceAmount) {
        throw new Error('Insufficent funds');
      }

      await this._transactionDB.create({
        amount: invoiceAmount,
        fromAccount: account.toJSON(),
        message: i18n.t('Paid invoice'),
        type: TransactionType.Outgoing,
      });

      await account.decrement('balance', { by: invoiceAmount });
      await this._invoiceDB.payInvoice(req.data.invoiceId);
      t.commit();
    } catch (err) {
      t.rollback();
      logger.error(err);
    }
  }
}
