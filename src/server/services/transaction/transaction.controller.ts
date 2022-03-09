import { TransactionEvents } from '../../../../typings/accounts';
import { Request, Response } from '../../../../typings/http';
import { Transaction, Transfer } from '../../../../typings/transactions';
import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { TransactionService } from './transaction.service';

@Controller('Transaction')
@PromiseEventListener()
export class TransactionController {
  private readonly _TransactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this._TransactionService = transactionService;
  }

  @NetPromise(TransactionEvents.Get)
  async getTransactions(req: Request<void>, res: Response<Transaction[]>) {
    const data = await this._TransactionService.handleGetMyTransactions(req.source);
    res({ status: 'ok', data });
  }

  @NetPromise(TransactionEvents.CreateTransfer)
  async transfer(req: Request<Transfer>, res: Response<{}>) {
    await this._TransactionService.handleTransfer(req);
    res({ status: 'ok', data: {} });
  }
}
