import { User } from '../../../typings/user';
import { config } from '../server-config';

const exp = global.exports;

export class UserModule {
  private readonly _source: number;
  public readonly identifier: string;

  constructor(user: User) {
    this._source = user.source;
    this.identifier = user.identifier;
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
