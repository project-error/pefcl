import { ServerExports } from '@server/../../typings/exports/server';
import { Export } from '@server/decorators/Export';
import { InvoiceEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import { Invoice, InvoiceInput, InvoiceOnlineInput, PayInvoiceInput } from '@typings/Invoice';
import { UserService } from 'services/user/user.service';
import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { InvoiceService } from './invoice.service';

@Controller('Invoice')
@PromiseEventListener()
export class InvoiceController {
  private readonly _InvoiceService: InvoiceService;
  private readonly _userService: UserService;

  constructor(transactionService: InvoiceService, userService: UserService) {
    this._InvoiceService = transactionService;
    this._userService = userService;
  }

  @NetPromise(InvoiceEvents.Get)
  async getInvoices(req: Request<void>, res: Response<Invoice[]>) {
    const data = await this._InvoiceService.getAllInvoicesBySource(req.source);
    return res({ status: 'ok', data: data });
  }

  @Export(ServerExports.CreateInvoice)
  @NetPromise(InvoiceEvents.CreateInvoice)
  async createInvoice(req: Request<InvoiceInput>, res: Response<Invoice>) {
    const data = await this._InvoiceService.createInvoice(req.data);
    return res({ status: 'ok', data: data.toJSON() });
  }

  @NetPromise(InvoiceEvents.CreateOnlineInvoice)
  async createOnlineInvoice(req: Request<InvoiceOnlineInput>, res: Response<Invoice>) {
    const toUser = this._userService.getUser(req.data.source);
    const fromUser = this._userService.getUser(req.source);
    const from = fromUser.name;
    const to = toUser.getIdentifier();

    const data = await this._InvoiceService.createInvoice({
      ...req.data,
      to,
      from,
    });

    return res({ status: 'ok', data: data.toJSON() });
  }

  @NetPromise(InvoiceEvents.PayInvoice)
  async payInvoice(req: Request<PayInvoiceInput>, res: Response<any>) {
    await this._InvoiceService.payInvoice(req);
    return res({ status: 'ok', data: {} });
  }
}
