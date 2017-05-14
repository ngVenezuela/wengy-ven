module.exports = (bot, chatId, messageText, replyMode = false, messageId) => {
  try {
    const defaultOptions = { parse_mode: 'Markdown' };
    if (replyMode && messageId) {
      Object.assign(defaultOptions, { reply_to_message_id: messageId });
    }
    bot.sendChatAction(chatId, 'typing');
    setTimeout(() => {
      bot.sendMessage(chatId, messageText, defaultOptions);
    }, 2000);
  } catch (e) {} // eslint-disable-line no-empty
};
