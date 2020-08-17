/* eslint-disable @typescript-eslint/no-var-requires */

const Sentry = require('@sentry/node');
const { Buffer } = require('buffer');

const config = require('../../api/_utils/config');
const Superfeedr = require('./SuperFeedr');

/* This is executed in a CI environment, so,
 * we have to update travis-ci env variables for this to work
 */
const {
  APP_URL,
  SENTRY_DNS,
  SUPERFEEDR_SECRET,
  SUPERFEEDR_TOKEN,
  SUPERFEEDR_USERNAME,
} = process.env;

Sentry.init({ dsn: SENTRY_DNS });

const rawFeeds = [
  ...config.githubFeeds,
  ...config.blogFeeds,
];

const feedsToUpdate = rawFeeds.map(({ feed }) => feed);

(async () => {
  try {
    const rawAuthorization = `${SUPERFEEDR_USERNAME}:${SUPERFEEDR_TOKEN}`;
    const base64Authorization = Buffer.from(rawAuthorization).toString('base64');
    const superfeedr = new Superfeedr(base64Authorization);

    const subscriptions = await superfeedr.subscriptions();
    const subscribedFeeds = subscriptions.map(( { subscription }) => subscription.feed.url);

    // remove feed start block
    const feedsToRemove = subscribedFeeds.filter(subscribedFeed => !feedsToUpdate.includes(subscribedFeed));
    if (feedsToRemove.length) {
      console.log('Feed(s) to be removed: ', feedsToRemove);
      const feedsToBeRemovedPromises = [];

      feedsToRemove.forEach(feed => {
        const promise = superfeedr.unsubscribe(feed);

        feedsToBeRemovedPromises.push(promise);
      });

      await Promise.all(feedsToBeRemovedPromises);
      console.log(`${feedsToRemove.length} feed(s) has been removed!`);
    } else {
      console.log('No feed(s) to be removed');
    }
    // remove feed end block

    // add feed start block
    const newFeedsToAdd = rawFeeds.filter(({ feed }) => !subscribedFeeds.includes(feed));
    if (newFeedsToAdd.length) {
      console.log('New feed(s) to be added: ', newFeedsToAdd);
      const feedsToBeAddedPromises = [];

      newFeedsToAdd.forEach(({ feed }) => {
        const promise = superfeedr.subscribe({
          callbackUrl: `${APP_URL}/api/superfeedr`,
          feed,
          secret: SUPERFEEDR_SECRET,
        });

        feedsToBeAddedPromises.push(promise);
      });

      await Promise.all(feedsToBeAddedPromises);
      console.log(`${newFeedsToAdd.length} feed(s) has been added!`);
    } else {
      console.log('No new feed(s) to be added');
    }
    // add feed end block

  } catch (error) {
    Sentry.captureException(error);
  }
})();
