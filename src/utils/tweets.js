const config = require('./../../config/config');
const sendMessage = require('./../utils/send-message');
const newTweetMessage = require('./../../config/messages').newTweet;
const hashtagMessage = require('./../../config/config').integrations.twitter.hashtagMessage;

/**
 * Construct and send the message to notify a new tweet in the group
 *
 * @param  {Object} bot     Telegram bot
 * @param  {Object} tweet   New tweet
 */
function sendNewTweet(bot, tweet) {
  const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

  sendMessage(
    bot,
    config.groupId,
    newTweetMessage
      .replace('#{tweetText}', tweet.text)
      .replace('#{tweetUrl}', tweetUrl)
      .replace('#{hashtagMessage}', hashtagMessage)
  );
}

module.exports = {
  sendNewTweet
};
