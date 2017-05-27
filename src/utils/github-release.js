const config = require('./../../config/config');
const githubReleaseMessage = require('./../../config/messages').githubRelease;
const sendMessage = require('./../utils/send-message');

const checkForRelease = (repository, feed) =>
  feed && feed.status.feed && feed.status.feed.search(repository) !== -1;

const sendRelease = (bot, release, repository, changelogExist) => {
  if (release.items.length === 0) {
    return;
  }

  const name = repository.match(/[\w.-]+$/gi)[0];

  release.items.forEach((item) => {
    const tag = item.id.match(/[\w.-]+$/gi)[0];

    sendMessage(
      bot,
      config.groupId,
      githubReleaseMessage
        .replace('#{name}', name)
        .replace('#{version}', tag)
        .replace(
        '#{url}',
        changelogExist
          ? `https://github.com/${repository}/blob/master/CHANGELOG.md`
          : `https://github.com/${repository}/releases/tag/${tag}`
        )
    );
  });
};

module.exports = {
  checkForRelease,
  sendRelease
};
