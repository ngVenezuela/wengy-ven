/**
 * Send group or supergroup's Id.
 * This will be used in config/telegram.js
 * @param {object} bot
 * @param {object} msg
 */
const sendGroupId = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatInfo = await bot.getChat(chatId);

  if (chatInfo.type === 'private') {
    bot.sendMessage(
      chatId,
      `Tú variable \`mainGroupId/adminGroupId\` es: ${chatInfo.id}`,
      {
        parse_mode: 'Markdown',
      }
    );
  }
};

module.exports = {
  sendGroupId,
};
