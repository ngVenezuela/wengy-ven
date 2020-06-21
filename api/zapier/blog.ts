import * as Sentry from "@sentry/node";
import { NowRequest, NowResponse } from "@vercel/node";

import config from "../_utils/config";
import messages from "../_utils/messages";
import isBasicAuthValid from "../_utils/zapier-auth";
import { sendMessage } from "../_utils/telegram/bot-methods";

const { MAIN_GROUP_ID, SENTRY_DSN, NODE_ENV } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

interface BlogFeed {
  actor: {
    displayName: string;
  };
  permalinkUrl: string;
  title: string;
}

const handleBlogFeed = async (feed: BlogFeed) => {
  if (MAIN_GROUP_ID) {
    await sendMessage({
      chatId: Number(MAIN_GROUP_ID),
      text: messages.newBlogPost
        .replace("#{author}", feed.actor.displayName)
        .replace("#{link}", feed.permalinkUrl)
        .replace("#{title}", feed.title)
    });
  }
};

export default async (request: NowRequest, response: NowResponse) => {
  try {
    if (isBasicAuthValid(request.headers.authorization)) {
      const updatedFeed = request.body.feed;
      const isBlogFeedListed = config.blogFeeds.find(
        ({ feed }) => feed === updatedFeed
      );

      if (isBlogFeedListed) {
        /*
          TODO: for the blog to work we have to wait until this is
          closed: https://github.com/thepracticaldev/dev.to/issues/3363
          We might have to update the next method as well
        */
        await handleBlogFeed(request.body);
      }

      response.status(200).send("ok");
    } else {
      response.status(401).send("Unauthorized");
    }
  } catch (error) {
    if (NODE_ENV === "development") {
      console.error(error);
    } else {
      Sentry.captureException(error);
    }

    response.status(400).send("not ok");
  }
};
