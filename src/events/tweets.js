const EventEmitter = require('events').EventEmitter;
const Twit = require('twit');

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

    const client = new Twit({
      consumer_key: twitterConfig.auth.consumerKey,
      consumer_secret: twitterConfig.auth.consumerSecret,
      access_token: twitterConfig.auth.accessTokenKey,
      access_token_secret: twitterConfig.auth.accessTokenSecret,
      timeout_ms: 60 * 1000
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

    const stream = client.stream('statuses/filter', { follow: twitterConfig.id });

    stream.on('tweet', (tweet) => {
      if (tweetIsNotAReply(tweet) && !tweetIsRt(tweet)) {
        this.emit('newTweet', tweet);
      } else if (rtToOtherAccountsExceptConfigured(tweet)) {
        this.emit('newTweet', tweet);
      }
    });

    stream.on('error', (error) => {
      throw new Error(`Twitter error: ${error}`);
    });
  }
}

module.exports = new TweetEvent();
