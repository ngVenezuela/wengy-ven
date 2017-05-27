const groupId = require('./../../config/config').groupId;
const blogFeedUrl = require('./../../config/config').blogFeedUrl;
const newBlogPostMessage = require('./../../config/messages').newBlogPost;
const sendMessage = require('./../utils/send-message');

function checkForBlogEntry(feed) {
  return feed.status.feed === blogFeedUrl;
}

function sendNewBlogEntries(bot, feed) {
  feed.items.forEach((article) => {
    setTimeout(() => {
      sendMessage(
        bot,
        groupId,
        newBlogPostMessage
          .replace('#{author}', article.actor.displayName)
          .replace('#{link}', article.permalinkUrl)
          .replace('#{title}', article.title)
      );
    });
  });
}

module.exports = {
  checkForBlogEntry,
  sendNewBlogEntries
};
