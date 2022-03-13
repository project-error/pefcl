import { InvoiceEvents } from '../../../../typings/accounts';
import { Request, Response } from '../../../../typings/http';
import { Invoice, InvoiceInput, PayInvoiceInput } from '../../../../typings/Invoice';
import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { InvoiceService } from './invoice.service';

@Controller('Invoice')
@PromiseEventListener()
export class InvoiceController {
  private readonly _InvoiceService: InvoiceService;

  constructor(transactionService: InvoiceService) {
    this._InvoiceService = transactionService;
  }

  @NetPromise(InvoiceEvents.Get)
  async getInvoices(req: Request<void>, res: Response<Invoice[]>) {
    const data = await this._InvoiceService.getAllInvoicesBySource(req.source);
    return res({ status: 'ok', data });
  }

  @NetPromise(InvoiceEvents.CreateInvoice)
  async createInvoice(req: Request<InvoiceInput>, res: Response<Invoice>) {
    const data = await this._InvoiceService.createInvoice(req);
    return res({ status: 'ok', data: data.toJSON() });
  }

  @NetPromise(InvoiceEvents.PayInvoice)
  async payInvoice(req: Request<PayInvoiceInput>, res: Response<any>) {
    await this._InvoiceService.payInvoice(req);
    return res({ status: 'ok', data: {} });
  }
}
