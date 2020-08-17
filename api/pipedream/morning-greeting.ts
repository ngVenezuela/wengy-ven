import * as Sentry from '@sentry/node';
import { NowRequest, NowResponse } from '@vercel/node';

import messages from '../_utils/messages';
import { sendMessage } from '../_utils/telegram/bot-methods';
import isBasicAuthValid from '../_utils/basic-auth';

const {
  MAIN_GROUP_ID,
  SENTRY_DSN,
  NODE_ENV,
  PIPEDREAM_USERNAME,
  PIPEDREAM_PASSWORD,
} = process.env;

Sentry.init({ dsn: SENTRY_DSN });

// aparently when eslint is run, it always create a long func
// eslint-disable-next-line max-len
const generateRandomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getMorningMessage = () => {
  const { goodMornings } = messages;

  const now = new Date();
  const weekday = now.getDay();

  const weekDays: { [index: number]: string } = {
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
    goodMornings[weekDays[weekday]].length - 1,
  );

  return goodMornings[weekDays[weekday]][randomIndex];
};

export default async (request: NowRequest, response: NowResponse): Promise<void> => {
  try {
    const matchingUsername = PIPEDREAM_USERNAME || '';
    const matchingPassword = PIPEDREAM_PASSWORD || '';
    const authorization = request.headers.authorization || '';

    if (
      isBasicAuthValid(
        authorization,
        matchingUsername,
        matchingPassword,
      )
    ) {
      const text = getMorningMessage();

      if (MAIN_GROUP_ID) {
        await sendMessage({ chatId: Number(MAIN_GROUP_ID), text });
      }

      response.status(200).send('ok');
    } else {
      response.status(401).send('Unauthorized');
    }
  } catch (error) {
    if (NODE_ENV === 'development') {
      console.error(error);
    } else {
      Sentry.captureException(error);
    }

    response.status(400).send('not ok');
  }
};
