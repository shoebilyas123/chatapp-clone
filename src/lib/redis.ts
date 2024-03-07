import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

class RedisCli {
  private _cli: RedisClientType;

  get cli(): RedisClientType {
    return this.cli;
  }
  constructor() {
    this._cli = createClient();
  }
  async connect() {
    this.cli.connect();
  }
}

export default new RedisCli();
