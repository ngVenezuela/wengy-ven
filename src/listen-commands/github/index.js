const fetch = require('node-fetch');
const Sentry = require('@sentry/node');

const { gistCreated, gistRecommendation } = require('config/messages');
const { sendMessage } = require('bot-api-overrides');

const { GITHUB_ACCESS_TOKEN } = process.env;
const MAX_LENGTH_GIST_TEXT = 200;

/**
 * Send wengy's github repo link
 * @param {object} bot
 * @param {object} msg
 */
const sendCommunityRepo = (bot, msg) =>
  sendMessage(bot, msg.chat.id, 'https://github.com/ngVenezuela/wengy-ven');

/**
 * Check gist considerations.
 * It may send a message or it may
 * send the gist directly
 * @param {object} bot
 * @param {object} msg
 * @param {string} text
 */
const sendGist = (bot, msg, text = '') => {
  if (text === '') {
    return;
  }
  const chatId = msg.chat.id;
  const { firstName = '', lastName = '', username = '' } = msg.from;
  const fullName =
    firstName === '' && lastName === '' ? '' : `${firstName} ${lastName} `;
  const user = username === '' ? '' : `(@${username})`;
  const filename = `${new Date().toISOString()}.js`;

  const body = {
    description: gistCreated
      .replace('#{fullName}', fullName)
      .replace('#{user}', user),
    public: true,
    files: {
      [filename]: {
        content: text,
      },
    },
  };

  fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then(({ html_url: link }) => {
      sendMessage(bot, chatId, link, { reply_to_message_id: msg.message_id });
    })
    .catch(error => {
      Sentry.captureException(error);
    });
};

/**
 * Check if entity of message
 * is a code (eg. ```Hello world```)
 * @param {object} bot
 * @param {object} msg
 */
const verifyCode = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatInfo = await bot.getChat(chatId);

  if (chatInfo.type === 'group') {
    if (!Object.prototype.hasOwnProperty.call(msg, 'entities')) {
      return;
    }

    if (msg.entities[0].type !== 'pre') {
      return;
    }

    if (msg.text.length >= MAX_LENGTH_GIST_TEXT) {
      sendMessage(bot, msg.chat.id, gistRecommendation, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'Markdown',
      });
    } else {
      sendGist(bot, msg, msg.text);
    }
  }
};

module.exports = {
  sendCommunityRepo,
  sendGist,
  verifyCode,
};
