const fetch = require('node-fetch');
const apiAIConfig = require('./../../config/config').integrations.apiAI;
const botUsername = require('./../../config/config').community.telegram.botUsername;
const sendMessage = require('./message').sendMessage;
const commandUtility = require('./../utils/command');

/**
 * Verify that api.ai has a valid
 * response to the query
 * @param {object} response
 */
const apiAiHasResponse = response =>
  response.result &&
  response.result.fulfillment &&
  response.result.fulfillment.messages.length > 0 &&
  response.result.fulfillment.messages[0].speech !== '';

/**
 * Verify that the message is a reply to the bot itself
 * @param {object} msgContext
 */
const botHasReplies = msgContext =>
  Object.prototype.hasOwnProperty.call(msgContext, 'reply_to_message') &&
  msgContext.reply_to_message.from.username === botUsername;

/**
 * Verify that the bot was mentioned in a text
 * @param {array} entities
 * @param {string} text
 */
const botWasMentioned = (entities, text) =>
  entities &&
  entities.findIndex(entity => entity.type === 'mention') > -1 &&
  text.includes(`@${botUsername}`);

/**
 * Makes a http request to api.ai with a query
 * @param {object} bot
 * @param {string} queryString
 * @param {number} chatId
 * @param {number} messageId
 * @param {number} sessionId
 */
const query = (bot, queryString, chatId, messageId, sessionId) => {
  const { queryUrl, clientAccessToken } = apiAIConfig;
  if (clientAccessToken) {
    fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiAIConfig.clientAccessToken}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        lang: 'es',
        sessionId,
        query: queryString
      })
    })
      .then(response => response.json())
      .then((response) => {
        if (apiAiHasResponse(response)) {
          sendMessage(
            bot,
            chatId,
            response.result.fulfillment.messages[0].speech,
            true,
            messageId
          );
        }
      }).catch((error) => {
        throw new Error(`Error getting api.ai message: ${error}`);
      });
  }
};

/**
 * First, it verifies if user can query the bot,
 * and that it's not a command.
 * Then it's checked that the bot was: replied to, mentioned,
 * or is in a private chat
 * @param {object} bot
 * @param {object} msgContext
 * @param {object} redisClient
 */
const canBotRespondToThis = (bot, msgContext, redisClient) => {
  commandUtility.verifyCommand(redisClient, '/bot', msgContext.from.id)
    .then((canExecuteCommand) => {
      if (canExecuteCommand && !(/^\//).test(msgContext.text)) {
        if (botHasReplies(msgContext)) {
          query(
            bot,
            msgContext.text,
            msgContext.chat.id,
            msgContext.message_id,
            msgContext.from.id
          );
        } else if (botWasMentioned(msgContext.entities, msgContext.text)) {
          query(
            bot,
            msgContext.text.replace(`@${botUsername}`, ''),
            msgContext.chat.id,
            msgContext.message_id,
            msgContext.from.id
          );
        } else if (msgContext.chat.type === 'private') {
          query(
            bot,
            msgContext.text,
            msgContext.chat.id,
            msgContext.message_id,
            msgContext.from.id
          );
        }
      }
    });
};

module.exports = {
  canBotRespondToThis
};
