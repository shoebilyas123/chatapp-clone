const { createClient } = require('redis');

// For chat key in redis-"CHAT:<id1>|<id2>";

class RedisService {
  #client;

  get client() {
    return this.#client;
  }
  set client(_value) {
    this.#client = _value;
  }
  async connect() {
    this.client = new createClient().on('error', console.log).connect();
  }
}

module.exports = RedisService;
