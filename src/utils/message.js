const forwardMessage = (bot, chatId, fromChatId, messageId, options = {}) => {
  try {
    bot.forwardMessage(chatId, fromChatId, messageId, options);
  } catch (error) {
    throw new Error(`Could not forward message: ${error}`);
  }
};

const sendMessage = (bot, chatId, messageText, replyMode = false, messageId = null) => {
  try {
    const defaultOptions = { parse_mode: 'Markdown' };
    if (replyMode && messageId) {
      Object.assign(defaultOptions, { reply_to_message_id: messageId });
    }

    bot.sendChatAction(chatId, 'typing');
    setTimeout(() => bot.sendMessage(chatId, messageText, defaultOptions), 1000);
  } catch (error) {
    throw new Error(`Could not send message: ${error}`);
  }
};

module.exports = {
  sendMessage,
  forwardMessage
};
