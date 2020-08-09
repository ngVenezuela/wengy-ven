import crypto from 'crypto';
import { Buffer } from 'buffer';
import * as Sentry from '@sentry/node';
import { NowRequest, NowResponse } from '@vercel/node';

import config from '../_utils/config';
import handleGithubFeed from '../_utils/github/feed';
import handleBlogFeed from '../_utils/blog/feed';
import getRawBody from '../_utils/http';

const { SENTRY_DSN, NODE_ENV, SUPERFEEDR_SECRET } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

// Taken from https://documentation.superfeedr.com/schema.html
interface Item {
  title: string;
}

/**
 * @description Used to verify that the request comes from Superfeedr
 * @see https://www.w3.org/TR/websub/#signature-validation
 */
const validateSignature = (
  headers: { [index: string]: any },
  body: Buffer,
) => {
  const signatureHeaderName = 'x-hub-signature';

  if (typeof headers[signatureHeaderName] === 'undefined') {
    throw new TypeError(
      `validateSignature: header ${signatureHeaderName} not found`,
    );
  }

  const signature = `sha1=${crypto
    .createHmac('sha1', SUPERFEEDR_SECRET ?? '')
    .update(body)
    .digest('hex')}`;

  return crypto.timingSafeEqual(
    Buffer.from(headers[signatureHeaderName]),
    Buffer.from(signature),
  );
};

export default async (request: NowRequest, response: NowResponse) => {
  try {
    if (request.method === 'POST') {
      const rawBody = await getRawBody(request);

      if (validateSignature(request.headers, rawBody)) {
        const updatedFeed = request.body.status.feed;

        if (updatedFeed.startsWith('https://github.com')) {
          const repoConfig = config.githubFeeds.find(
            ({ feed }) => feed === updatedFeed,
          );
          const tags = request.body.items.map(
            (item: Item) => item.title,
          );

          if (repoConfig) {
            await handleGithubFeed(repoConfig, tags);
          }
        } else {
          // If it isn't a github feed, it's a blog feed
          const isBlogFeedListed = config.blogFeeds.find(
            ({ feed }) => feed === updatedFeed,
          );

          if (isBlogFeedListed) {
            await handleBlogFeed(request.body.items);
          }
        }

        response.status(200).send('ok');
      } else {
        response.status(400).send('signature is not valid');
      }
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
