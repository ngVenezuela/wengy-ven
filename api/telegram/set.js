import fetch from 'node-fetch';
import * as Sentry from '@sentry/node';

const { TELEGRAM_BOT_TOKEN, APP_URL, SENTRY_DSN } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

/* used to activate webhook whenever we change the APP_URL */
export default async (request, response) => {
  try {
    if (request.query.token === TELEGRAM_BOT_TOKEN) {
      const fetchResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${APP_URL}/api/telegram/update?token=${TELEGRAM_BOT_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const jsonResponse = await fetchResponse.json();

      response.status(200).json(jsonResponse);
    } else {
      response.status(401).send('Unauthorized');
    }
  } catch (error) {
    Sentry.captureException(error);

    response.status(400).send('not ok');
  }
};
