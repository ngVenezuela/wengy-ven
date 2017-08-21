const EventEmitter = require('events').EventEmitter;

/**
 * Class representing an EventEmitter
 * @extends EventEmitter
 */
class Superfeedr extends EventEmitter {

  /**
   * Check for a valid superfeedr object
   * @param {object} msg
   * @see https://documentation.superfeedr.com/schema.html
   */
  checkMessage(msg) {
    return msg.status &&
      msg.status.code &&
      msg.status.http &&
      msg.status.feed;
  }

  /**
   * Emit message to subscribers
   * @param {object} msg - Message to emit
   */
  proccessMessage(msg) {
    this.emit('newFeed', msg);
  }

}

module.exports = Superfeedr;
