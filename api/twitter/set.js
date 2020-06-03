import * as Sentry from '@sentry/node';
import { Autohook } from 'twitter-autohook';

const {
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_WEBHOOK_ENV,
  SENTRY_DSN,
  APP_URL,
  NODE_ENV,
} = process.env;

Sentry.init({ dsn: SENTRY_DSN });

/* used to activate webhook whenever we change the APP_URL OR env variables have been compromised */
export default async(request, response) => {
  console.time('ms-set-test');
  try {
    if (request.query.consumerKey === TWITTER_CONSUMER_KEY) {
      const webhook = new Autohook({
        token: TWITTER_ACCESS_TOKEN,
        token_secret: TWITTER_ACCESS_TOKEN_SECRET,
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        env: TWITTER_WEBHOOK_ENV
      });

      await webhook.removeWebhooks();
      await webhook.start(`${APP_URL}/api/twitter/update`);
      await webhook.subscribe({
        oauth_token: TWITTER_ACCESS_TOKEN,
        oauth_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
      });

      response.status(200).send('ok');
    } else {
      response.status(401).send('Unauthorized');
    }
  } catch (error) {
    if (NODE_ENV === 'development') {
      console.log('error: ', error);
    } else {
      Sentry.captureException(error);
    }

    response.status(400).send('not ok');
  } finally {
    console.timeEnd('ms-set-test');
  }
};
