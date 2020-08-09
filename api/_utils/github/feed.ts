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
  tags: string[],
) => {
  if (MAIN_GROUP_ID) {
    const promises: Promise<void>[] = [];

    tags.forEach(tag => {
      const promise = sendMessage({
        chatId: Number(MAIN_GROUP_ID),
        text: messages.githubRelease
          .replace('#{name}', repoConfig.name)
          .replace('#{version}', tag)
          .replace(
            '#{url}',
            repoConfig.hasChangelog
              ? `https://github.com/${repoConfig.name}/blob/master/CHANGELOG.md`
              : `https://github.com/${repoConfig.name}/releases/tag/${tag}`,
          ),
      });

      promises.push(promise);
    });

    await Promise.all(promises);
  }
};

export default handleGithubFeed;
