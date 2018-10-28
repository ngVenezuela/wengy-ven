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

    const { consumerKey, consumerSecret, accessTokenKey, accessTokenSecret} = twitterConfig.auth;
    if (consumerKey && consumerSecret && accessTokenKey && accessTokenSecret) {
      const client = new Twit({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token: accessTokenKey,
        access_token_secret: accessTokenSecret,
        timeout_ms: 60 * 1000
      });

      const isNotANewTweet = tweet =>
        tweet.retweeted || tweet.retweeted_status || tweet.in_reply_to_status_id || tweet.in_reply_to_user_id || tweet.delete;

      const stream = client.stream('user', { follow: twitterConfig.id });

      stream.on('tweet', (tweet) => {
        if(!isNotANewTweet(tweet)) {
          this.emit('newTweet', tweet);
        }
      });

      stream.on('error', (error) => {
        throw new Error(`Twitter error: ${error}`);
      });
    }
  }
}

module.exports = new TweetEvent();
