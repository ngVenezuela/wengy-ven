import * as Sentry from '@sentry/node';

import messages from '../_utils/messages';
import isBasicAuthValid from '../_utils/zapier-auth';
import { sendMessage } from '../_utils/telegram/bot-methods';

const { MAIN_GROUP_ID, SENTRY_DSN, NODE_ENV } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

/**
 * Generate random Integer with values with range: min-max
 * @param {number} min - Min value
 * @param {number} max - Max value
 * @return {number} Random Integer value
 */
const generateRandomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Get morning message depending
 * on what day of the week it is
 * @return {string}
 */
const getMorningMessage = () => {
  const { goodMornings } = messages;

  const now = new Date();
  const weekday = now.getDay();

  const weekDays = {
    0: 'generic',
    1: 'mondays',
    2: 'generic',
    3: 'generic',
    4: 'generic',
    5: 'fridays',
    6: 'generic',
  };

  const randomIndex = generateRandomBetween(
    0,
    goodMornings[weekDays[weekday]].length - 1
  );

  return goodMornings[weekDays[weekday]][randomIndex];
};

export default async(request, response) => {
  try {
    if (isBasicAuthValid(request.headers.authorization)) {
      const text = getMorningMessage();

      await sendMessage({ chatId: MAIN_GROUP_ID, text });

      response.status(200).send('ok')
    } else {
      response.status(401).send('Unauthorized')
    }
  } catch (error) {
    if (NODE_ENV === 'development') {
      console.log('error: ', error);
    } else {
      Sentry.captureException(error);
    }

    response.status(400).send('not ok');
  }
};
