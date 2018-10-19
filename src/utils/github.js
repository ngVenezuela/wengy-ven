const fetch = require('node-fetch');

const groupId = require('./../../config/config').community.telegram.groupId;
const releasesToCheck = require('./../../config/config').integrations.githubReleases;
const githubReleaseMessage = require('./../../config/messages').githubRelease;
const githubOpenVeLinkMessage = require('./../../config/messages').githubOpenVeLink;
const gistCreated = require('./../../config/messages').gistCreated;
const telegramLink = require('./../../config/config').community.telegram.link;
const githubLink = require('./../../config/config').community.github;
const gistRecommendation = require('./../../config/messages').gistRecommendation;
const githubToken = require('./../../config/config').integrations.github.accessToken;

const sendMessage = require('./../utils/message').sendMessage;
const commandUtility = require('./../utils/command');

const GITHUB_LINK_OPENVE_TELEGRAM_COMMUNITY = 'https://github.com/OpenVE/comunidades-en-telegram';
const GIST_COMMAND = '/gist';
const MAX_LENGTH_GIST_TEXT = 200;

/**
 * Check if it's a valid github release
 * @param {string} repository
 * @param {string} feed
 * @return {boolean}
 */
const isItAGithubRelease = (repository, feed) =>
  feed &&
  feed.status.feed &&
  feed.status.feed.search(repository) !== -1;

/**
 * Send github release message to group
 * @param {object} bot
 * @param {array} release
 * @param {string} repository
 * @param {boolean} changelogExist
 */
const sendRelease = (bot, release, repository, changelogExist) => {
  if (release.items.length === 0) {
    return;
  }

  // eslint-disable-next-line no-useless-escape
  const name = repository.match(/[\w\.-]+$/gi)[0];

  release.items.forEach((item) => {
    // eslint-disable-next-line no-useless-escape
    const tag = item.id.match(/[\w\.-]+$/gi)[0];

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

/**
 * Check and send github release
 * @param {object} bot
 * @param {object} feed
 */
const checkAndSendRelease = (bot, feed) => {
  const releaseFound =
    releasesToCheck.find(release => isItAGithubRelease(release.repo, feed));

  if (releaseFound) {
    sendRelease(bot, feed, releaseFound.repo, releaseFound.hasChangelog);
  }
};

/**
 * Prepare the gist, and send it to group
 * @param {object} bot
 * @param {object} msgContext
 * @param {boolean} checkingForCode
 * @param {string} code
 */
const prepareAndSendGist = (
  bot, msgContext,
  checkingForCode, code = ''
) => {
  const chatId = msgContext.chat.id;
  const { firstName = '', lastName = '', username = '' } = msgContext.from;
  const fullName = firstName === '' && lastName === '' ? '' : `${firstName} ${lastName} `;
  const user = username === '' ? '' : `(@${username})`;
  const filename = `${new Date().toISOString()}.js`;
  const gist = checkingForCode ? msgContext.text : code;

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
      'Authorization': `token ${githubToken}`
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(({ html_url }) => sendMessage(bot, chatId, html_url, true, msgContext.message_id))
    .catch((error) => {
      throw new Error(`Could not create gist: ${error}`);
    });
};

/**
 * Check gist considerations.
 * It may send a message or it may
 * send the gist directly
 * @param {object} bot
 * @param {object} msgContext
 * @param {*} redisClient
 * @param {*} text
 * @param {boolean} checkingForCode
 */
const checkGist = (bot, msgContext, redisClient, text = '', checkingForCode = true) => {
  commandUtility.verifyCommand(redisClient, GIST_COMMAND, msgContext.from.id)
  .then((canExecuteCommand) => {
      if (canExecuteCommand) {
        if (text === '' && msgContext.text.length >= MAX_LENGTH_GIST_TEXT) {
          if (checkingForCode) {
            sendMessage(bot, msgContext.chat.id, gistRecommendation, true, msgContext.message_id);
          }
        } else {
          prepareAndSendGist(bot, msgContext, checkingForCode, text);
        }
      }
    });
};

/**
 * Check if entity of message
 * is a code (eg. ```Hello world```)
 * @param {object} bot
 * @param {object} msgContext
 * @param {object} redisClient
 */
const checkForCode = (bot, msgContext, redisClient) => {
  if (!Object.prototype.hasOwnProperty.call(msgContext, 'entities')) {
    return;
  }

  if (msgContext.entities[0].type !== 'pre') {
    return;
  }

  checkGist(bot, msgContext, redisClient);
};

/**
 * Send the OpenVE github
 * community link to the group
 * @param {object} bot
 * @param {object} msgContext
 * @param {string} command
 * @param {object} redisClient
 */
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
    });
};

/**
 * Send wengy's github repo link
 * @param {object} bot
 * @param {object} msgContext
 * @param {string} command
 * @param {object} redisClient
 */
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
    });
};

module.exports = {
  checkAndSendRelease,
  checkForCode,
  sendOpenVeGithubLink,
  sendCommunityRepo,
  checkGist
};
