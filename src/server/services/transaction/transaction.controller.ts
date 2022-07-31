import { TransactionEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import {
  GetTransactionHistoryResponse,
  GetTransactionsInput,
  GetTransactionsResponse,
  CreateTransferInput,
} from '@typings/Transaction';
import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { TransactionService } from './transaction.service';

@Controller('Transaction')
@PromiseEventListener()
export class TransactionController {
  private readonly _transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this._transactionService = transactionService;
  }

  @NetPromise(TransactionEvents.Get)
  async getTransactions(
    req: Request<GetTransactionsInput>,
    res: Response<GetTransactionsResponse>,
  ) {
    try {
      const transactions = await this._transactionService.handleGetMyTransactions(req);
      res({ status: 'ok', data: transactions });
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }

  @NetPromise(TransactionEvents.CreateTransfer)
  async createTransfer(req: Request<CreateTransferInput>, res: Response<object>) {
    try {
      await this._transactionService.handleTransfer(req);
      res({ status: 'ok', data: {} });
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }

  @NetPromise(TransactionEvents.GetHistory)
  async getHistory(req: Request<void>, res: Response<GetTransactionHistoryResponse>) {
    try {
      const history = await this._transactionService.handleGetHistory(req);
      res({ status: 'ok', data: history });
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }
}
