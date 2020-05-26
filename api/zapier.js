import { Buffer } from 'buffer';
import * as Sentry from '@sentry/node';

import config from './_utils/config';
import messages from './_utils/messages';
import { sendMessage } from './_utils/telegram/bot-methods';

const { MAIN_GROUP_ID, SENTRY_DSN, NODE_ENV, ZAPIER_BASIC_AUTH_USERNAME, ZAPIER_BASIC_AUTH_PASSWORD } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

const handleBlogFeed = async(feed) => {
  await sendMessage({
    chatId: MAIN_GROUP_ID,
    text: messages.newBlogPost
      .replace('#{author}', feed.actor.displayName)
      .replace('#{link}', feed.permalinkUrl)
      .replace('#{title}', feed.title),
  });
};

/**
 *
 * @param {object} repoConfig
 * @param {string} repoConfig.repo
 * @param {boolean} repoconfig.hasChangelog
 * @param {object} newFeed
 * @param {string} newFeed.id
 */
const handleGithubFeed = async(repoConfig, newFeed) => {
  /* we get the reponame, and ignore the rest */
  const repoName = repoConfig.repo.match(/[\w\.-]+$/gi)[0];

  /* we get the tag version, and ignore the rest */
  const tag = newFeed.id.match(/[\w\.-]+$/gi)[0];

  await sendMessage({
    chatId: MAIN_GROUP_ID,
    text: messages.githubRelease
      .replace('#{name}', repoName)
      .replace('#{version}', tag)
      .replace(
        '#{url}',
        repoConfig.hasChangelog
          ? `https://github.com/${repoConfig.repo}/blob/master/CHANGELOG.md`
          : `https://github.com/${repoConfig.repo}/releases/tag/${tag}`
    )
  });
};

const isAuthValid = (authorizationHeader = '') => {
  const token = authorizationHeader.split(/\s+/).pop() || '';

  const auth = new Buffer.from(token, 'base64').toString();
  const parts = auth.split(/:/);

  const username = parts[0];
  const password = parts[1];

  return username === ZAPIER_BASIC_AUTH_USERNAME && password === ZAPIER_BASIC_AUTH_PASSWORD
};

export default async(request, response) => {
  try {
    if (isAuthValid(request.headers.authorization)) {
      const updatedFeed = request.body.feed;

      const isUpdatedFeedListed = config.feeds.find(({ feed }) => feed === updatedFeed);
      const isBlogFeed = isUpdatedFeedListed && isUpdatedFeedListed.name === 'blog';

      if (isUpdatedFeedListed) {
        if (isBlogFeed) {
          /* TODO: for the blog to work we have to wait until this is closed: https://github.com/thepracticaldev/dev.to/issues/3363 */
          // await handleBlogFeed(request.body);
        } else {
          /* we can assume it's github, because only have the blog and github feeds */
          await handleGithubFeed(isUpdatedFeedListed, request.body);
        }
      }

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

    /* keep zapier servers happy, error already reported */
    response.status(200).send('ok');
  }
};
