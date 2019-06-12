/**
 * Send main or admin's group id.
 * This will be used in config/telegram.js
 * @param {object} bot
 * @param {object} msg
 */
const sendGroupId = async (bot, msg) => {
  const {
    chat: { id: chatId },
  } = msg;
  const chatInfo = await bot.getChat(chatId);

  if (['group', 'supergroup'].includes(chatInfo.type)) {
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
