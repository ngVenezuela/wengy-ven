const sendMessage = require('./send-message');
const commandUtility = require('./../utils/command');

const sendGroupId = (bot, chatId, fromId, command, redisClient) => {
  commandUtility.verifyCommand(redisClient, command, fromId)
    .then((canExecuteCommand) => {
      if (canExecuteCommand) {
        bot.getChat(chatId).then((info) => {
          if (info.type === 'group') {
            sendMessage(
              bot,
              info.id,
              `Tú variable \`config.community.telegram.groupId\` es: ${info.id}`
            );
          }
        });
      }
    })
    .catch(() => { });
};

module.exports = {
  sendGroupId
};
