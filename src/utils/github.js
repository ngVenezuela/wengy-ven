const fetch = require('node-fetch');

const groupId = require('./../../config/config').community.telegram.groupId;
const releasesToCheck = require('./../../config/config').integrations.githubReleases;
const githubReleaseMessage = require('./../../config/messages').githubRelease;
const githubOpenVeLinkMessage = require('./../../config/messages').githubOpenVeLink;
const gistCreated = require('./../../config/messages').gistCreated;
const telegramLink = require('./../../config/config').community.telegram.link;
const githubLink = require('./../../config/config').community.github;

const sendMessage = require('./../utils/send-message');
const commandUtility = require('./../utils/command');

const GITHUB_LINK_OPENVE_TELEGRAM_COMMUNITY = 'https://github.com/OpenVE/comunidades-en-telegram';
const GIST_COMMAND = '/gist';

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

const checkForCode = (bot, msgContext, redisClient) => {
  commandUtility.verifyCommand(redisClient, GIST_COMMAND, msgContext.from.id)
    .then((canExecuteCommand) => {
      if (canExecuteCommand) {
        if (!Object.prototype.hasOwnProperty.call(msgContext, 'entities')) {
          return;
        }

        if (msgContext.entities[0].type !== 'pre') {
          return;
        }

        if (msgContext.text.length >= 200) {
          return;
        }

        const chatId = msgContext.chat.id;
        const { firstName = '', lastName = '', username = '' } = msgContext.from;
        const fullName = firstName === '' && lastName === '' ? '' : `${firstName} ${lastName} `;
        const user = username === '' ? '' : `(@${username})`;
        const filename = `${new Date().toISOString()}.js`;
        const gist = msgContext.text;

        const body = {
          description: gistCreated
            .replace('#{fullName}', fullName)
            .replace('#{user}', user)
            .replace('#{telegramLink}', telegramLink)
            .replace('#{githubLink}', githubLink),
          public: true,
          files: {
            [filename]: {
              content: gist
            }
          }
        };

        fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(({ html_url }) => {
            sendMessage(bot, chatId, html_url, true, msgContext.message_id);
          }).catch(() => { });
      }
    })
    .catch(() => { });
};

const sendOpenVeGithubLink = (bot, msgContext, command, redisClient) => {
  commandUtility.verifyCommand(redisClient, command, msgContext.from.id)
    .then((canExecuteCommand) => {
      if (canExecuteCommand) {
        sendMessage(
          bot,
          msgContext.chat.id,
          githubOpenVeLinkMessage.replace('#{link}', GITHUB_LINK_OPENVE_TELEGRAM_COMMUNITY)
        );
      }
    })
    .catch(() => { });
};

const sendCommunityRepo = (bot, msgContext, command, redisClient) => {
  commandUtility.verifyCommand(redisClient, command, msgContext.from.id)
    .then((canExecuteCommand) => {
      if (canExecuteCommand) {
        sendMessage(
          bot,
          msgContext.chat.id,
          githubLink
        );
      }
    })
    .catch(() => { });
};

module.exports = {
  checkAndSendRelease,
  checkForCode,
  sendOpenVeGithubLink,
  sendCommunityRepo
};
