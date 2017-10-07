const config = require('./../../config/config');
const sendMessage = require('./../utils/message').sendMessage;
const newTweetMessage = require('./../../config/messages').newTweet;
const hashtagMessage = require('./../../config/config').integrations.twitter.hashtagMessage;

/**
 * Remove some html entities
 * @param {string} text
 * @see https://core.telegram.org/bots/api#html-style
 */
const sanitizeTweet = text =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Construct and send the message to notify
 * a new tweet in the group
 *
 * @param  {Object} bot     Telegram bot
 * @param  {Object} tweet   New tweet
 */
const sendNewTweet = (bot, tweet) => {
  const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
  sendMessage(
    bot,
    config.community.telegram.groupId,
    newTweetMessage
      .replace('#{tweetText}', sanitizeTweet(tweet.text))
      .replace('#{tweetUrl}', tweetUrl)
      .replace('#{hashtagMessage}', hashtagMessage),
    false,
    null,
    true
  );
};

module.exports = {
  sendNewTweet
};
