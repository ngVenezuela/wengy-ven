const groupId = require('./../../config/config').groupId;
const newBlogPostMessage = require('./../../config/messages').newBlogPost;
const sendMessage = require('./../utils/send-message');

function sendNewArticles(bot, articles) {
  articles.forEach((article) => {
    setTimeout(() => {
      sendMessage(
        bot,
        groupId,
        newBlogPostMessage
          .replace('#{author}', article.author)
          .replace('#{link}', article.link)
          .replace('#{title}', article.title)
      );
    });
  });
}

module.exports = {
  sendNewArticles
};
