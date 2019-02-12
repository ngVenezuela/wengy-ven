const { feeds, mainGroupId } = require('config/telegram');
const { githubRelease } = require('config/messages');
const { sendMessage } = require('bot-api-overrides');

const handleGithubRelease = (bot, body) => {
  const items = body.items;
  const feed = body.status.feed;

  const release = feeds.find(
    githubRelease => githubRelease.feed === feed && githubRelease.repo
  );

  const name = release.repo.match(/[\w\.-]+$/gi)[0];

  items.forEach(item => {
    const tag = item.id.match(/[\w\.-]+$/gi)[0];

    sendMessage(
      bot,
      mainGroupId,
      githubRelease
        .replace('#{name}', name)
        .replace('#{version}', tag)
        .replace(
          '#{url}',
          release.changelogExist
            ? `https://github.com/${release.repo}/blob/master/CHANGELOG.md`
            : `https://github.com/${release.repo}/releases/tag/${tag}`
        ),
      {
        parse_mode: 'Markdown',
      }
    );
  });
};

module.exports = handleGithubRelease;
