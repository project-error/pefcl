import { AccountServiceExports } from '@typings/exports';
import { OnlineUser } from '@typings/user';
import { config } from '@utils/server-config';

const exp = global.exports;

export class UserModule {
  private readonly _source: number;
  private readonly _resource: AccountServiceExports;
  public readonly identifier: string;
  public readonly name: string;

  constructor(user: OnlineUser) {
    this._source = user.source;
    this.identifier = user.identifier;
    this.name = user.name;
    this._resource = exp[config?.exports?.resourceName ?? 'none'];
  }

  getSource() {
    return this._source;
  }

  getIdentifier() {
    return this.identifier;
  }

  getBalance() {
    return this._resource.getCurrentBalance(this._source);
  }

  getBankBalance(): number {
    return this._resource.getCurrentBankBalance(this._source);
  }
}
