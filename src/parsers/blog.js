const { mainGroupId } = require('config/telegram');
const { newBlogPost } = require('config/messages');
const { sendMessage } = require('bot-api-overrides');

const handleBlogEntry = (bot, body) => {
  const items = body.items;
  if (items) {
    items.forEach(article => {
      sendMessage(
        bot,
        mainGroupId,
        newBlogPost
          .replace('#{author}', article.actor.displayName)
          .replace('#{link}', article.permalinkUrl)
          .replace('#{title}', article.title),
        {
          parse_mode: 'Markdown',
        }
      );
    });
  }
};

module.exports = handleBlogEntry;
