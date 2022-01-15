import { UserService } from './user.service';
import { Controller } from '../decorators/Controller';
import { NetPromise, PromiseEventListener } from '../decorators/NetPromise';
import { Request, Response } from '../../../typings/http';

@Controller('User')
@PromiseEventListener()
export class UserController {
  private readonly _userService: UserService;
  constructor(userService: UserService) {
    this._userService = userService;
  }

  @NetPromise('nfwd:getUser')
  async handleGetUser(req: Request, res: Response<any>) {
    res({ status: 'ok', data: 'fuck you' });
  }
}
