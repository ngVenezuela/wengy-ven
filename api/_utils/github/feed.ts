import messages from '../messages';
import { sendMessage } from '../telegram/bot-methods';

const { MAIN_GROUP_ID } = process.env;

interface RepoConfig {
  hasChangelog: boolean;
  name: string;
  feed: string;
}

const handleGithubFeed = async (
  repoConfig: RepoConfig,
  urls: string[],
): Promise<void> => {
  if (MAIN_GROUP_ID) {
    const promises: Promise<void>[] = [];
    const repoMainUrl = repoConfig.feed.replace('releases.atom', '');

    urls.forEach(url => {
      const tag = url.match(/[\w.-]+$/gi)![0];

      const promise = sendMessage({
        chatId: Number(MAIN_GROUP_ID),
        text: messages.githubRelease
          .replace('#{name}', repoConfig.name)
          .replace('#{version}', tag)
          .replace(
            '#{url}',
            repoConfig.hasChangelog
              ? `${repoMainUrl}blob/master/CHANGELOG.md`
              : url,
          ),
      });

      promises.push(promise);
    });

    await Promise.all(promises);
  }
};

export default handleGithubFeed;
