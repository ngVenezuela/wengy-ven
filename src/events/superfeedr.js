const EventEmitter = require('events').EventEmitter;

class Superfeedr extends EventEmitter {

  checkMessage(msg) {
    return msg.status && msg.status.code && msg.status.http && msg.status.feed;
  }

  proccessMessage(msg) {
    this.emit('newFeed', msg);
  }

}

module.exports = Superfeedr;
