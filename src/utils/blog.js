const groupId = require('./../../config/config').groupId;
const newBlogPostMessage = require('./../../config/messages').newBlogPost;

function sendNewArticles(bot, articles) {
  articles.forEach((article) => {
    bot.sendMessage(
      groupId,
      newBlogPostMessage
        .replace('#{author}', article.author)
        .replace('#{link}', article.link)
        .replace('#{title}', article.title),
      { parse_mode: 'Markdown' }
    );
  });
}

module.exports = {
  sendNewArticles
};
