const groupId = require('./../../config/config').community.telegram.groupId;
const releasesToCheck = require('./../../config/config').integrations.githubReleases;
const githubReleaseMessage = require('./../../config/messages').githubRelease;
const sendMessage = require('./../utils/send-message');

const isItAGithubRelease = (repository, feed) =>
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
      groupId,
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

const checkAndSendRelease = (bot, feed) => {
  const releaseFound =
    releasesToCheck.find(release => isItAGithubRelease(release.repo, feed));

  if (releaseFound) {
    sendRelease(bot, feed, releaseFound.repo, releaseFound.hasChangelog);
  }
};

module.exports = {
  checkAndSendRelease,
  isItAGithubRelease,
  sendRelease
};
