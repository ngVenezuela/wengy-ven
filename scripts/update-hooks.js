const fetch = require('node-fetch');
const Sentry = require('@sentry/node');

/* This is executed in a CI environment, so, we have to update travis-ci env variables for this to work */
const { APP_URL, SENTRY_DNS, TELEGRAM_BOT_TOKEN, TWITTER_CONSUMER_KEY } = process.env;

Sentry.init({ dsn: SENTRY_DNS });

(async() => {
  try {
    // setting telegram webhook after deploy
    const telegramResponse = await fetch(`${APP_URL}/api/telegram/set?token=${TELEGRAM_BOT_TOKEN}`);
    const jsonTelegramResponse = await telegramResponse.json();

    console.log('telegram response: ', jsonTelegramResponse);

    // setting twitter webhook after deploy
    const twitterResponse = await fetch(`${APP_URL}/api/twitter/set?consumerKey=${TWITTER_CONSUMER_KEY}`);
    const textTwitterResponse = await twitterResponse.text();

    console.log('twitter response: ', textTwitterResponse);
  } catch (error) {
    Sentry.captureException(error);
  }
})();
