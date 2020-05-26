import * as Sentry from '@sentry/node';

import handleListenCommands from '../_utils/telegram/commands';
import handleListenEvents from '../_utils/telegram/events';

const { NODE_ENV, SENTRY_DSN, TELEGRAM_BOT_TOKEN } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

export default async(request, response) => {
  try {
    if (request.query.token === TELEGRAM_BOT_TOKEN) {
      const message = request.body.message;

      await handleListenEvents(message);
      await handleListenCommands(message);

      response.status(200).send('ok')
    } else {
      response.status(401).send('Unauthorized');
    }
  } catch (error) {
    if (NODE_ENV === 'development') {
      console.log('error: ', error);
    } else {
      Sentry.captureException(error);
    }

    /* keep telegram servers happy, error already reported */
    response.status(200).send('ok');
  }
};
