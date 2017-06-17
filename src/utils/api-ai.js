const fetch = require('node-fetch');
const apiAIConfig = require('./../../config/config').integrations.apiAI;
const botUsername = require('./../../config/config').community.telegram.botUsername;
const sendMessage = require('./send-message');
const commandUtility = require('./../utils/command');

const validResponse = response =>
  response.result && response.result.fulfillment &&
  response.result.fulfillment.messages.length > 0 &&
  response.result.fulfillment.messages[0].speech !== '';

const botHasReplies = msgContext =>
  Object.prototype.hasOwnProperty.call(msgContext, 'reply_to_message') &&
    msgContext.reply_to_message.from.username === botUsername;

const botWasMentioned = (entities, text) =>
  entities && entities.findIndex(entity => entity.type === 'mention') > -1 &&
  text.includes(`@${botUsername}`);

const query = (bot, queryString, chatId, messageId, userId) => {
  fetch(apiAIConfig.queryUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiAIConfig.clientAccessToken}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      lang: 'es',
      sessionId: userId,
      query: queryString
    })
  })
    .then(response => response.json())
    .then((response) => {
      if (validResponse(response)) {
        sendMessage(
          bot,
          chatId,
          response.result.fulfillment.messages[0].speech,
          true,
          messageId
        );
      }
    }).catch(() => {});
};

const canBotRespondToThis = (bot, msgContext, redisClient) => {
  commandUtility.verifyCommand(redisClient, '/bot', msgContext.from.id)
    .then((canExecuteCommand) => {
      if (canExecuteCommand) {
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
        }
      }
    })
    .catch(() => { });
};

module.exports = {
  canBotRespondToThis
};
