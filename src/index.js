require('dotenv').config();
const ngrok = require('ngrok');
const Sentry = require('@sentry/node');

const handleListenCommands = require('./listen-commands');
const handleTimeEvents = require('./time-events');
const WebhookServer = require('./webhooks/server');
const { Telegram, Superfeedr } = require('./webhooks');
const { handleBlogEntry, handleGithubRelease } = require('parsers');

//NOTE: About the port -> https://core.telegram.org/bots/api#setwebhook
const {
  APP_URL,
  TELEGRAM_BOT_TOKEN,
  NODE_ENV,
  SENTRY_DSN,
  APP_PORT,
} = process.env;

const telegramBot = new Telegram(TELEGRAM_BOT_TOKEN);
const superfeedr = new Superfeedr();
Sentry.init({ dsn: SENTRY_DSN });

initializeBot = async () => {
  if (NODE_ENV === 'development') {
    const url = await ngrok.connect(APP_PORT);
    console.log(
      `use this url in your webhhoks along with the token. example: ${url}/MY_SECRET_TOKEN: `,
      url
    );
    telegramBot.setWebHook(`${url}/${TELEGRAM_BOT_TOKEN}`);
  } else {
    telegramBot.setWebHook(`${APP_URL}/${TELEGRAM_BOT_TOKEN}`);
  }
};

initializeBot();
handleListenCommands(telegramBot);
handleTimeEvents(telegramBot);

new WebhookServer(`/${TELEGRAM_BOT_TOKEN}`, APP_PORT)
  .subscribe(telegramBot)
  .subscribe(superfeedr);

superfeedr.on('newGithubRelease', msg => {
  handleGithubRelease(telegramBot, msg);
});

superfeedr.on('newBlogEntry', msg => {
  handleBlogEntry(telegramBot, msg);
});

process.on('SIGUSR2', () => {
  if (NODE_ENV === 'development') {
    telegramBot.closeWebHook();
    ngrok.disconnect();
  }
});

process.on('uncaughtException', error => {
  Sentry.captureException(error);
  throw new Error(error);
});
