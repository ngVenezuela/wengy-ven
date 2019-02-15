const Sentry = require('@sentry/node');

const forwardMessage = (bot, chatId, fromChatId, messageId, options = {}) => {
  try {
    bot.sendChatAction(chatId, 'typing');
    bot.forwardMessage(chatId, fromChatId, messageId, options);
  } catch (error) {
    Sentry.captureException(error);
  }
};

const sendMessage = (bot, chatId, text, options = {}) => {
  try {
    bot.sendChatAction(chatId, 'typing');
    setTimeout(() => {
      bot.sendMessage(chatId, text, options);
    }, 500);
  } catch (error) {
    Sentry.captureException(error);
  }
};

module.exports = {
  forwardMessage,
  sendMessage,
};
