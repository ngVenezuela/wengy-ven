import messages from '../messages';
import { sendMessage } from '../telegram/bot-methods';

const { MAIN_GROUP_ID } = process.env;

interface BlogFeed {
  actor: {
    displayName: string;
  };
  permalinkUrl: string;
  title: string;
}

/**
 * TODO: for the ngVenezuela blog to work we have to wait until this is
 * closed: https://github.com/thepracticaldev/dev.to/issues/3363
 */
const handleBlogFeed = async (feeds: BlogFeed[]) => {
  if (MAIN_GROUP_ID) {
    const promises: Promise<void>[] = [];

    feeds.forEach(feed => {
      const promise = sendMessage({
        chatId: Number(MAIN_GROUP_ID),
        text: messages.newBlogPost
          .replace('#{author}', feed.actor.displayName)
          .replace('#{link}', feed.permalinkUrl)
          .replace('#{title}', feed.title),
      });

      promises.push(promise);
    });

    await Promise.all(promises);
  }
};

export default handleBlogFeed;
