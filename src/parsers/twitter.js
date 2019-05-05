const { mainGroupId } = require('config/telegram');
const { newTweet } = require('config/messages');
const { sendMessage } = require('bot-api-overrides');

const isRt = tweet => tweet.retweeted || tweet.retweeted_status;

const isReply = tweet =>
  tweet.in_reply_to_status_id || tweet.in_reply_to_user_id;

const handleTweet = (bot, tweets = []) => {
  tweets.forEach(tweet => {
    if (!isReply(tweet) && !isRt(tweet)) {
      const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${
        tweet.id_str
      }`;

      sendMessage(
        bot,
        mainGroupId,
        newTweet
          .replace('#{tweetText}', tweet.text)
          .replace('#{tweetUrl}', tweetUrl),
        {
          parse_mode: 'Markdown',
        }
      );
    }
  });
};

module.exports = handleTweet;
