/**
 * Forward telegram message
 * @param {object} bot
 * @param {number} chatId
 * @param {number} fromChatId
 * @param {number} messageId
 * @param {object} options
 * @see https://github.com/yagop/node-telegram-bot-api/blob/release/doc/api.md#TelegramBot+forwardMessage
 */
const forwardMessage = (bot, chatId, fromChatId, messageId, options = {}) => {
  try {
    bot.forwardMessage(chatId, fromChatId, messageId, options);
  } catch (error) {
    throw new Error(`Could not forward message: ${error}`);
  }
};

/**
 * Send telegram message
 * @param {object} bot
 * @param {number} chatId
 * @param {string} messageText
 * @param {boolean} replyMode
 * @param {number} messageId
 * @param {boolean} htmlMode
 */
const sendMessage = (
  bot, chatId, messageText, replyMode = false, messageId = null, htmlMode = false
) => {
  try {
    const defaultOptions = { parse_mode: htmlMode ? 'HTML' : 'Markdown' };
    if (replyMode && messageId) {
      Object.assign(defaultOptions, { reply_to_message_id: messageId });
    }

    bot.sendChatAction(chatId, 'typing');
    setTimeout(() => bot.sendMessage(chatId, messageText, defaultOptions), 500);
  } catch (error) {
    throw new Error(`Could not send message: ${error}`);
  }
};

module.exports = {
  sendMessage,
  forwardMessage
};
