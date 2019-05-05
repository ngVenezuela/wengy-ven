const { EventEmitter } = require('events');

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
    return msg.status && msg.status.code && msg.status.http && msg.status.feed;
  }

  /**
   * Emit message to subscribers
   * @param {object} msg - Message to emit
   */
  processMessage(msg) {
    if (msg.status.feed.startsWith('https://medium.com')) {
      return this.emit('newBlogEntry');
    }

    this.emit('newGithubRelease', msg);
  }
}

module.exports = Superfeedr;
