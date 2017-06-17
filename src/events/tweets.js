const EventEmitter = require('events').EventEmitter;
const Twitter = require('twitter');
const twitterConfig = require('./../../config/config').integrations.twitter;

class TweetEvent extends EventEmitter {
  constructor() {
    super();

    const client = new Twitter({
      consumer_key: twitterConfig.auth.consumerKey,
      consumer_secret: twitterConfig.auth.consumerSecret,
      access_token_key: twitterConfig.auth.accessTokenKey,
      access_token_secret: twitterConfig.auth.accessTokenSecret
    });

    const tweetIsNotAReply = tweet => tweet.in_reply_to_status_id === null;

    const tweetIsRt = tweet => Object.hasOwnProperty.call(tweet, 'retweeted_status');

    const rtToOtherAccountsExceptConfigured = tweet =>
      tweetIsRt(tweet) &&
        tweet.retweeted_status.user.id_str !== twitterConfig.id;

    client
      .stream('statuses/filter', { follow: twitterConfig.id }, (stream) => {
        stream.on('data', (tweet) => {
          // validating that tweet is not a reply and neither a RT
          if (tweetIsNotAReply(tweet) && !tweetIsRt(tweet)) {
            this.emit('newTweet', tweet);
          // validating that tweet is a RT, but not to the configured account
          } else if (rtToOtherAccountsExceptConfigured(tweet)) {
            this.emit('newTweet', tweet);
          }
        });

        stream.on('error', () => {});
      });
  }
}

module.exports = new TweetEvent();
