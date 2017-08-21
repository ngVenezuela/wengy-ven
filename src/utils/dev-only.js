const sendMessage = require('./message').sendMessage;
const commandUtility = require('./../utils/command');

/**
 * Send group or supergroup's Id.
 * This will be used in config/config.js
 * @param {object} bot
 * @param {number} chatId
 * @param {number} fromId
 * @param {string} command
 * @param {object} redisClient
 */
const sendGroupId = (bot, chatId, fromId, command, redisClient) => {
  commandUtility.verifyCommand(redisClient, command, fromId)
    .then((canExecuteCommand) => {
      if (canExecuteCommand) {
        bot.getChat(chatId).then((info) => {
          if (['group', 'supergroup'].includes(info.type)) {
            sendMessage(
              bot,
              info.id,
              `Tú variable \`config.community.telegram.groupId\` es: ${info.id}`
            );
          }
        });
      }
    });
};


module.exports = {
  sendGroupId
};
