const bodyParser = require('body-parser');
const express = require('express');

class BotServer {

  constructor(path, port) {
    this.webhooks = [];

    const app = express();

    // parse the updates to JSON
    app.use(bodyParser.json());

    // We are receiving updates at the route below!
    app.post(path, (req, res) => {
      this.webhooks.forEach(webhook =>
        webhook.checkMessage(req.body) && webhook.proccessMessage(req.body)
      );

      res.sendStatus(200).end();
    });

    // Start Express Server
    app.listen(port, () => {});
  }

  subscribe(webhook) {
    if (BotServer.isWebHook(webhook)) {
      this.webhooks.push(webhook);
      return this;
    }

    throw new Error('Invalid argument exception');
  }

  static isWebHook(webhook) {
    return webhook && webhook.checkMessage && webhook.proccessMessage;
  }

}

module.exports = BotServer;
