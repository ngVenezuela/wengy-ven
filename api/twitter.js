import crypto from 'crypto';
import * as Sentry from '@sentry/node';

import { sendMessage } from './_utils/telegram/bot-methods';
import messages from './_utils/messages';

const { TWITTER_CONSUMER_SECRET, MAIN_GROUP_ID, NODE_ENV, SENTRY_DSN } = process.env;

/* How to setup twitter webhook: https://github.com/twitterdev/autohook */

Sentry.init({ dsn: SENTRY_DSN });

const isRt = tweet => tweet.retweeted || tweet.retweeted_status;

const isReply = tweet =>
  tweet.in_reply_to_status_id || tweet.in_reply_to_user_id;

const handleTweets = async(tweets = []) => {
  for(const tweet of tweets) {
    if (!isReply(tweet) && !isRt(tweet)) {
      const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${
        tweet.id_str
      }`;

      await sendMessage({
        chatId: MAIN_GROUP_ID,
        text: messages.newTweet
          .replace('#{tweetText}', tweet.text)
          .replace('#{tweetUrl}', tweetUrl),
      });
    }
  }
};

/**
 * Genereate hash to validate twitter webhook
 * @param {string} crcToken
 * @param {string} twitterConsumerSecretKey
 * @see https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/securing-webhooks.html
 */
const getChallengeResponse = (crcToken, twitterConsumerSecretKey) =>
  crypto
    .createHmac('sha256', twitterConsumerSecretKey)
    .update(crcToken)
    .digest('base64');

export default async(request, response) => {
  try {
    if (request.method === 'GET') {
      const crcToken = request.query.crc_token;

      if (crcToken) {
        const hash = getChallengeResponse(crcToken, TWITTER_CONSUMER_SECRET);

        response.status(200).send({
          response_token: `sha256=${hash}`,
        });
      } else {
        response.status(400).send('Error: crc_token missing from request.');
      }
    } else if (request.method === 'POST') {
      const newTweets = request.body.tweet_create_events;

      await handleTweets(newTweets)

      response.status(200).send('ok');
    }
  } catch (error) {
    if (NODE_ENV === 'development') {
      console.log('error: ', error);
    } else {
      Sentry.captureException(error);
    }

    /* keep twitter servers happy, error already reported */
    response.status(200).send('ok');
  }
};
