var redis = require('redis');

function RedisStorage(settings) {
  this.connection = redis.createClient(
    settings.redis_port, settings.redis_host
  );
  // once a redis connection runs subscribe(), it will be in pub\sub mode.
  // that means it will only be useful for receiving events, so we need to store
  // two redis connections.
  this.pubsub = redis.createClient(settings.redis_port, settings.redis_host);
}
RedisStorage.prototype = {

  // regular key\value operations
  get: function(key, callback) {
    return this.connection.get(key, callback);
  },
  set: function(key, value, callback) {
    return this.connection.set(key, value, callback);  
  },
  sadd: function(key, value, callback) {
    return this.connection.sadd(key, value, callback);
  },
  srem: function(key, value, callback) {
    return this.connection.srem(key, value, callback);
  },
  smembers: function(key, callback) {
    return this.connection.smembers(key, callback);
  },

  // pub\sub operations
  publish: function(channel, data, callback) {
    return this.connection.publish(channel, data, callback);
  },
  subscribe: function(channel) {
    return this.pubsub.subscribe(channel);
  },
  on: function(event, callback) {
    return this.pubsub.on(event, callback);
  }

}

module.exports.Storage = RedisStorage;