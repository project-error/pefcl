import { singleton } from 'tsyringe';
import { UserService } from '../user/user.service';
import { mainLogger } from '../../sv_logger';
import { AccountDB } from 'services/account/account.db';
import { AccountRole } from '@typings/Account';
import { ServerError } from '@utils/errors';
import { GenericErrors } from '@typings/Errors';

const logger = mainLogger.child({ module: 'auth' });

@singleton()
export class AuthService {
  _accountDB: AccountDB;
  _userService: UserService;

  constructor(userService: UserService, accountDB: AccountDB) {
    this._userService = userService;
    this._accountDB = accountDB;
  }

  async isAuthorizedAccount(
    accountId: number,
    source: number,
    roles: AccountRole[],
  ): Promise<void> {
    const user = this._userService.getUser(source);
    const identifier = user.getIdentifier();

    logger.debug(`Authorizing user ${identifier} for account: ${accountId}`);

    const account =
      (await this._accountDB.getAuthorizedAccountById(accountId, identifier)) ??
      (await this._accountDB.getAuthorizedSharedAccountById(accountId, identifier, roles));

    if (!account) {
      throw new ServerError(GenericErrors.NotFound);
    }
  }
}
