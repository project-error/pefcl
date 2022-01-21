import { AccountEvents } from '../../../typings/accounts';
import { Request, Response } from '../../../typings/http';
import { Controller } from '../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../decorators/NetPromise';

@Controller('User')
@PromiseEventListener()
export class UserController {
  constructor() {}

  @NetPromise('getUser')
  getUser(req: Request, res: Response<any>) {}
}
