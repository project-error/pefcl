import { singleton } from 'tsyringe';

@singleton()
export class UserService {
  private readonly playersBySource: Map<number, any>; // Player class
  constructor() {
    this.playersBySource = new Map<number, any>();
  }

  getPlayer(source: number) {
    return this.playersBySource.get(source);
  }
}
