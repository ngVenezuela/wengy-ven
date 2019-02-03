/**
 * Send group or supergroup's Id.
 * This will be used in config/telegram.js
 * @param {object} bot
 * @param {object} msg
 */
const sendGroupId = async (bot, msg) => {
  const chatId = msg.chat.id;
  const chatInfo = await bot.getChat(chatId);

  if (['group', 'supergroup'].includes(chatInfo.type)) {
    bot.sendMessage(
      chatId,
      `Tú variable \`mainGroupId/adminGroupId\` es: ${chatInfo.id}`
    );
  }
};

module.exports = {
  sendGroupId,
};
