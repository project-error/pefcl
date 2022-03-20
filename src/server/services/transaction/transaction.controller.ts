import { TransactionEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import { GetTransactionsInput, GetTransactionsResponse, Transfer } from '@typings/transactions';
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
    const transactions = await this._transactionService.handleGetMyTransactions(req);
    res({ status: 'ok', data: transactions });
  }

  @NetPromise(TransactionEvents.CreateTransfer)
  async transfer(req: Request<Transfer>, res: Response<object>) {
    try {
      await this._transactionService.handleTransfer(req);
      res({ status: 'ok', data: {} });
    } catch (err) {
      res({ status: 'error', errorMsg: err.message });
    }
  }
}
