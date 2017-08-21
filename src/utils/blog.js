const groupId = require('./../../config/config').community.telegram.groupId;
const blogFeedUrl = require('./../../config/config').community.blogFeedUrl;
const newBlogPostMessage = require('./../../config/messages').newBlogPost;
const sendMessage = require('./../utils/message').sendMessage;

/**
 * Check if it's the blog feed
 * @param {object} feed
 */
const checkForBlogEntry = feed => feed.status.feed === blogFeedUrl;

/**
 * Send new entries to the group
 * @param {object} bot
 * @param {object} feed
 */
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
    }, 1000);
  });
};

/**
 * Check and sends new blog entries to the group
 * @param {object} bot
 * @param {object} feed
 */
const checkAndSendBlogEntry = (bot, feed) => {
  if (checkForBlogEntry(feed)) {
    sendNewBlogEntries(bot, feed);
  }
};

module.exports = {
  checkAndSendBlogEntry
};
