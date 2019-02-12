const fetch = require('node-fetch');
const { sendMessage } = require('bot-api-overrides');

const { DIALOGFLOW_CLIENT_ACCESS_TOKEN, BOT_USERNAME } = process.env;

/**
 * Verify that dialogflow has a valid
 * response to the query
 * @param {object} response
 */
const dialogFlowHasResponse = response =>
  response.result &&
  response.result.fulfillment &&
  response.result.fulfillment.messages.length > 0 &&
  response.result.fulfillment.messages[0].speech !== '';

/**
 * Verify that the message is a reply to the bot itself
 * @param {object} msg
 */
const botHasReplies = msg =>
  Object.prototype.hasOwnProperty.call(msg, 'reply_to_message') &&
  msg.reply_to_message.from.username === BOT_USERNAME;

/**
 * Verify that the bot was mentioned in a text
 * @param {array} entities
 * @param {string} text
 */
const botWasMentioned = (entities, text) =>
  entities &&
  entities.findIndex(entity => entity.type === 'mention') > -1 &&
  text.includes(`@${BOT_USERNAME}`);

/**
 * Makes a http request to api.ai with a query
 * @param {object} bot
 * @param {string} queryString
 * @param {object} msg
 */
const query = (bot, queryString, msg) => {
  if (DIALOGFLOW_CLIENT_ACCESS_TOKEN) {
    fetch('https://api.api.ai/v1/query?v=20150910', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIALOGFLOW_CLIENT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        lang: 'es',
        sessionId: msg.from.id,
        query: queryString,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (dialogFlowHasResponse(response)) {
          sendMessage(
            bot,
            msg.chat.id,
            response.result.fulfillment.messages[0].speech,
            { reply_to_message_id: msg.message_id }
          );
        }
      })
      .catch(error => {
        Sentry.captureException(error);
      });
  }
};

/**
 * Method that returns a text depending if it's a reply/mention/private message
 * @param {object} msg
 */
const getTextResponse = msg => {
  if (botWasMentioned(msg.entities, msg.text)) {
    return msg.text.replace(`@${BOT_USERNAME}`, '');
  } else if (botHasReplies(msg) || msg.chat.type === 'private') {
    return msg.text;
  }
};

/**
 * First, it verifies if user can query the bot,
 * and that it's not a command.
 * @param {object} bot
 * @param {object} msg
 */
const verifyResponse = (bot, msg) => {
  const notACommand = !/^\//.test(msg.text);
  if (notACommand) {
    query(bot, getTextResponse(msg), msg);
  }
};

module.exports = {
  verifyResponse,
};
