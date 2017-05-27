const sendMessage = require('./send-message');

const sendGroupId = (bot, msgContext) => {
  bot.getChat(msgContext.chat.id).then((info) => {
    if (info.type === 'group') {
      sendMessage(
        bot,
        info.id,
        `Tú variable \`config.groupId\` es: ${info.id}`
      );
    }
  });
};

module.exports = sendGroupId;
