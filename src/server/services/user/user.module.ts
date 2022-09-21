import { OnlineUser } from '@typings/user';

export class UserModule {
  private readonly _source: number;
  private readonly _identifier: string;
  public readonly name: string;
  public isClientLoaded: boolean;

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

  loadClient() {
    this.isClientLoaded = true;
  }
}
