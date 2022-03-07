import { TransactionEvents } from '../../../../typings/accounts';
import { Request, Response } from '../../../../typings/http';
import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { ITransaction } from './transaction.model';
import { TransactionService } from './transaction.service';

@Controller('Transaction')
@PromiseEventListener()
export class TransactionController {
  private readonly _TransactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this._TransactionService = transactionService;
  }

  @NetPromise(TransactionEvents.Get)
  async getTransactions(req: Request<void>, res: Response<ITransaction[]>) {
    const data = await this._TransactionService.handleGetMyTransactions(req.source);
    res({ status: 'ok', data });
  }
}
