import { singleton } from 'tsyringe';
import { Cash, ChangeCashInput } from '@typings/Cash';
import { config } from '@utils/server-config';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { CashDB } from './cash.db';
import { CashModel } from './cash.model';
import { Request } from '@typings/http';
import { ServerError } from '@utils/errors';
import { BalanceEvents } from '@typings/Events';
import { BalanceErrors, GenericErrors } from '@typings/Errors';
import { getFrameworkExports } from '@server/utils/frameworkIntegration';

const logger = mainLogger.child({ module: 'cash' });
const useFrameworkIntegration = config?.frameworkIntegration?.enabled;

@singleton()
export class CashService {
  _cashDB: CashDB;
  _userService: UserService;

  constructor(cashDB: CashDB, userService: UserService) {
    this._cashDB = cashDB;
    this._userService = userService;
  }

  private async getCashModel(source: number): Promise<CashModel | null> {
    const user = this._userService.getUser(source);
    return await this._cashDB.getCashByIdentifier(user?.getIdentifier() ?? '');
  }

  async getMyCash(source: number): Promise<number> {
    const user = this._userService.getUser(source);
    if (useFrameworkIntegration) {
      const exports = getFrameworkExports();
      return exports.getCash(user.getSource()) ?? 0;
    }

    const cash = await this.getCashModel(source);
    return cash?.getDataValue('amount') ?? 0;
  }

  async createInitialCash(src: number): Promise<Cash> {
    logger.debug(`Creating initial cash row for source: ${src}`);
    const user = this._userService.getUser(src);
    const cash = await this._cashDB.createInitial(user?.getIdentifier() ?? '');
    return cash.toJSON();
  }

  async giveCash(req: Request<ChangeCashInput>) {
    logger.debug(`source ${req.source}: Giving ${req.data.amount} to ${req.data.source}.`);

    const { amount } = req.data;
    const myCashAmount = await this.getMyCash(req.source);

    if (amount <= 0) {
      throw new ServerError(GenericErrors.BadInput);
    }

    if (myCashAmount < amount) {
      throw new ServerError(BalanceErrors.InsufficentFunds);
    }

    await this.handleAddCash(req.data.source, amount);
    await this.handleRemoveCash(req.source, amount);

    return true;
  }

  async handleRemoveCash(source: number, amount: number): Promise<CashModel | null> {
    logger.debug(`Taking ${amount} from ${source}`);
    const user = this._userService.getUser(source);
    const identifier = user.getIdentifier();

    if (useFrameworkIntegration) {
      const exports = getFrameworkExports();
      exports.removeCash(source, amount);
      return null;
    }

    const cash = await this._cashDB.getCashByIdentifier(identifier);
    if (!cash) {
      throw new Error(GenericErrors.NotFound);
    }
    await this._cashDB.decrement(cash, amount);

    emitNet(BalanceEvents.UpdateCashBalance, source, cash?.getDataValue('amount'));
    return null;
  }

  async handleAddCash(source: number, amount: number): Promise<CashModel | null> {
    logger.debug(`Giving ${amount} to ${source}`);
    const user = this._userService.getUser(source);
    const identifier = user.getIdentifier();

    if (useFrameworkIntegration) {
      const exports = getFrameworkExports();
      exports.addCash(source, amount);
      return null;
    }

    const cash = await this._cashDB.getCashByIdentifier(identifier);
    if (!cash) {
      throw new Error(GenericErrors.NotFound);
    }
    await this._cashDB.increment(cash, amount);

    emitNet(BalanceEvents.UpdateCashBalance, source, cash?.getDataValue('amount'));
    return cash;
  }
}
