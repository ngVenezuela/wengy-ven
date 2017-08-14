const groupId = require('./../../config/config').community.telegram.groupId;
const blogFeedUrl = require('./../../config/config').community.blogFeedUrl;
const newBlogPostMessage = require('./../../config/messages').newBlogPost;
const sendMessage = require('./../utils/message').sendMessage;

const checkForBlogEntry = feed => feed.status.feed === blogFeedUrl;

const sendNewBlogEntries = (bot, feed) => {
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
};

const checkAndSendBlogEntry = (bot, feed) => {
  if (checkForBlogEntry(feed)) {
    sendNewBlogEntries(bot, feed);
  }
};

module.exports = {
  checkAndSendBlogEntry
};
