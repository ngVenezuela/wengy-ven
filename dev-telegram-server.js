const fetch = require('node-fetch');
const ngrok = require('ngrok');

require('dotenv').config();

const { TELEGRAM_BOT_TOKEN, APP_PORT } = process.env;
let url;

(async () => {
  /* vercel uses port 3000 as default, make sure APP_PORT env variable is set to the same port */
  url = await ngrok.connect(APP_PORT);
  console.log('Almost ready, proxy url: ', url);
})();

/**
 * @see https://core.telegram.org/bots/api#getupdates
 * @param {number} offset
 */
const poll = async(offset = 0) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jsonResponse = await response.json();

    if (jsonResponse.ok && jsonResponse.result.length) {
      /* send updates to vercel */
      for (const result of jsonResponse.result) {
        await fetch(`${url}/api/telegram/update?token=${TELEGRAM_BOT_TOKEN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
        });
      }

      /* recalculating offset according to latest response */
      const lastIndex = jsonResponse.result.length - 1;
      const newOffset = jsonResponse.result[lastIndex].update_id + 1;

      setTimeout(() => {
        poll(newOffset);
      }, 1500);
    } else if (jsonResponse.ok) {
      /* no updates, poll again in a bit */
      setTimeout(() => {
        poll();
      }, 1500);
    } else {
      console.error(`Telegram error: ${jsonResponse.result}`);
    }
  } catch (error) {
    console.error('An unexpected error ocurred: ', error);
  }
};

poll();
