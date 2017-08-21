const EventEmitter = require('events').EventEmitter;
const Twitter = require('twitter');
const twitterConfig = require('./../../config/config').integrations.twitter;

/**
 * Class representing an EventEmitter
 * @extends NodeTelegramBotApi
 */
class TweetEvent extends EventEmitter {
  /**
   * Creates an instance of EventEmitter
   */
  constructor() {
    super();

    const client = new Twitter({
      consumer_key: twitterConfig.auth.consumerKey,
      consumer_secret: twitterConfig.auth.consumerSecret,
      access_token_key: twitterConfig.auth.accessTokenKey,
      access_token_secret: twitterConfig.auth.accessTokenSecret
    });

    /**
     * Validating that tweet is not a reply and neither a RT
     * @param {object} tweet
     */
    const tweetIsNotAReply = tweet => tweet.in_reply_to_status_id === null;

    /**
     * Validating that tweet is a RT
     * @param {object} tweet
     */
    const tweetIsRt = tweet => Object.hasOwnProperty.call(tweet, 'retweeted_status');

    /**
     * Validating that RT is to other accounts,
     * except the one configured in config
     * @param {object} tweet
     */
    const rtToOtherAccountsExceptConfigured = tweet =>
      tweetIsRt(tweet) &&
        tweet.retweeted_status.user.id_str !== twitterConfig.id;

    client
      .stream('statuses/filter', { follow: twitterConfig.id }, (stream) => {
        stream.on('data', (tweet) => {
          if (tweetIsNotAReply(tweet) && !tweetIsRt(tweet)) {
            this.emit('newTweet', tweet);
          } else if (rtToOtherAccountsExceptConfigured(tweet)) {
            this.emit('newTweet', tweet);
          }
        });

        stream.on('error', (error) => {
          throw new Error(`Twitter error: ${error}`);
        });
      });
  }
}

module.exports = new TweetEvent();
