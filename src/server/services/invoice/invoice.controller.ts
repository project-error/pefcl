import { ServerExports } from '@server/../../typings/exports/server';
import { Export, ExportListener } from '@server/decorators/Export';
import { InvoiceEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import {
  Invoice,
  CreateInvoiceInput,
  InvoiceOnlineInput,
  PayInvoiceInput,
  GetInvoicesInput,
  GetInvoicesResponse,
} from '@typings/Invoice';
import { UserService } from 'services/user/user.service';
import { Controller } from '../../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../../decorators/NetPromise';
import { InvoiceService } from './invoice.service';

@Controller('Invoice')
@ExportListener()
@PromiseEventListener()
export class InvoiceController {
  private readonly _InvoiceService: InvoiceService;
  private readonly _userService: UserService;

  constructor(transactionService: InvoiceService, userService: UserService) {
    this._InvoiceService = transactionService;
    this._userService = userService;
  }

  @Export(ServerExports.GetInvoices)
  @NetPromise(InvoiceEvents.Get)
  async getInvoices(req: Request<GetInvoicesInput>, res: Response<GetInvoicesResponse>) {
    const data = await this._InvoiceService.getAllInvoicesBySource(req);
    return res({
      status: 'ok',
      data: {
        ...req.data,
        ...data,
      },
    });
  }

  @Export(ServerExports.GetUnpaidInvoices)
  @NetPromise(InvoiceEvents.CountUnpaid)
  async countUnpaid(req: Request<number>, res: Response<number>) {
    const count = await this._InvoiceService.countUnpaidInvoices(req.source);
    return res({
      status: 'ok',
      data: count,
    });
  }

  @Export(ServerExports.CreateInvoice)
  @NetPromise(InvoiceEvents.CreateInvoice)
  async createInvoice(req: Request<CreateInvoiceInput>, res: Response<Invoice>) {
    const data = await this._InvoiceService.createInvoice(req.data);
    return res({ status: 'ok', data: data.toJSON() });
  }

  @NetPromise(InvoiceEvents.CreateOnlineInvoice)
  async createOnlineInvoice(req: Request<InvoiceOnlineInput>, res: Response<Invoice>) {
    const toUser = this._userService.getUser(req.data.source);
    const fromUser = this._userService.getUser(req.source);
    const from = fromUser.name;

    const data = await this._InvoiceService.createInvoice({
      ...req.data,
      from: from,
      to: toUser.name,
      toIdentifier: toUser.getIdentifier(),
      fromIdentifier: fromUser.getIdentifier(),
    });

    return res({ status: 'ok', data: data.toJSON() });
  }

  @Export(ServerExports.PayInvoice)
  @NetPromise(InvoiceEvents.PayInvoice)
  async payInvoice(req: Request<PayInvoiceInput>, res: Response<any>) {
    await this._InvoiceService.payInvoice(req);
    return res({ status: 'ok', data: {} });
  }
}
