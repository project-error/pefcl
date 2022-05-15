import { OnlineUser } from '@typings/user';

export class UserModule {
  private readonly _source: number;
  private readonly _identifier: string;
  public readonly name: string;

  constructor(user: OnlineUser) {
    this._source = user.source;
    this._identifier = user.identifier;
    this.name = user.name;
  }

  getSource() {
    return this._source;
  }

  getIdentifier() {
    return this._identifier;
  }
}
