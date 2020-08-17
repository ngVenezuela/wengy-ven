/* eslint-disable @typescript-eslint/no-var-requires */

const fetch = require('node-fetch');

class Superfeedr {
  authorization;
  BASE_URL = 'https://push.superfeedr.com';

  constructor(authorization) {
    if (!authorization) {
      throw new Error('Cannot initialize superfeedr class without an authorization');
    }

    this.authorization = authorization;
  }

  async subscribe({feed, callbackUrl, secret}) {
    return await fetch(`${this.BASE_URL}?hub.mode=subscribe&authorization=${this.authorization}&hub.topic=${feed}&hub.callback=${callbackUrl}&hub.secret=${secret}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async subscriptions() {
    const rawSubscriptions = await fetch(`${this.BASE_URL}?hub.mode=list&authorization=${this.authorization}`);

    return await rawSubscriptions.json();
  }

  async unsubscribe(feed) {
    return await fetch(`${this.BASE_URL}?hub.mode=unsubscribe&authorization=${this.authorization}&hub.topic=${feed}`, {
      method: 'POST',
    });
  }
}

module.exports = Superfeedr;
