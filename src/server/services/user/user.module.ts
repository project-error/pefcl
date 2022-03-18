import { OnlineUser } from '@typings/user';
import { config } from '@utils/server-config';

const exp = global.exports;

export class UserModule {
  private readonly _source: number;
  public readonly identifier: string;
  public readonly name: string;

  constructor(user: OnlineUser) {
    this._source = user.source;
    this.identifier = user.identifier;
    this.name = user.name;
  }

  getSource() {
    return this._source;
  }

  getIdentifier() {
    return this.identifier;
  }

  getBalance(): number {
    return exp[config.exports.resourceName].getCurrentBalance(this._source);
  }

  getBankBalance(): number {
    return exp[config.exports.resourceName].getCurrentBankBalance(this._source);
  }
}
