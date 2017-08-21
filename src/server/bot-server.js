const bodyParser = require('body-parser');
const express = require('express');

/**
 * Class representing
 * bot/telegram-bot and
 * events/superfeedr
 */
class BotServer {

  /**
   * Creates an instance for
   * bot/telegram-bot and events/superfeedr
   * to subscribe to
   * @param {string} path
   * @param {string} port
   */
  constructor(path, port) {
    this.webhooks = [];

    const app = express();

    // parse the updates to JSON
    app.use(bodyParser.json());

    // We are receiving updates at the route below!
    app.post(path, (req, res) => {
      this.webhooks.forEach(webhook =>
        webhook.checkMessage(req.body) &&
        webhook.proccessMessage(req.body)
      );

      res.sendStatus(200).end();
    });

    // Start Express Server
    app.listen(port, () => {});
  }

  /**
   * Verify that passed webhook has
   * checkMessage and processMessage
   * class instance methods
   * @param {object} webhook
   */
  static isWebHook(webhook) {
    return webhook &&
      webhook.checkMessage &&
      webhook.proccessMessage;
  }

  /**
   * Add webhook to express server
   * @param {object} webhook
   */
  subscribe(webhook) {
    if (BotServer.isWebHook(webhook)) {
      this.webhooks.push(webhook);
      return this;
    }

    throw new Error('Invalid argument exception');
  }
}

module.exports = BotServer;
