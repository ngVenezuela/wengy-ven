import * as Sentry from "@sentry/node";
import { NowRequest, NowResponse } from "@vercel/node";

import config from "../_utils/config";
import messages from "../_utils/messages";
import isBasicAuthValid from "../_utils/zapier-auth";
import { sendMessage } from "../_utils/telegram/bot-methods";

const { MAIN_GROUP_ID, SENTRY_DSN, NODE_ENV } = process.env;

Sentry.init({ dsn: SENTRY_DSN });

interface RepoConfig {
  repo: string;
  hasChangelog: boolean;
}

interface GithubFeed {
  id: string;
}

const handleGithubFeed = async (
  repoConfig: RepoConfig,
  newFeed: GithubFeed
) => {
  /* we get the reponame, and ignore the rest */
  const repoName = repoConfig.repo.match(/[\w.-]+$/gi)![0];

  /* we get the tag version, and ignore the rest */
  const tag = newFeed.id.match(/[\w.-]+$/gi)![0];

  if (MAIN_GROUP_ID) {
    await sendMessage({
      chatId: Number(MAIN_GROUP_ID),
      text: messages.githubRelease
        .replace("#{name}", repoName)
        .replace("#{version}", tag)
        .replace(
          "#{url}",
          repoConfig.hasChangelog
            ? `https://github.com/${repoConfig.repo}/blob/master/CHANGELOG.md`
            : `https://github.com/${repoConfig.repo}/releases/tag/${tag}`
        )
    });
  }
};

export default async (request: NowRequest, response: NowResponse) => {
  try {
    if (isBasicAuthValid(request.headers.authorization)) {
      const updatedFeed = request.body.feed;
      const isGithubFeedListed = config.githubFeeds.find(
        ({ feed }) => feed === updatedFeed
      );

      if (isGithubFeedListed) {
        await handleGithubFeed(isGithubFeedListed, request.body);
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
