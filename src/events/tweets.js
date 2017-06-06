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

    const otherThanMyselfRT = tweet =>
      Object.hasOwnProperty.call(tweet, 'retweeted_status') && tweet.retweeted_status.user.id_str !== twitterConfig.id;

    client
      .stream('statuses/filter', { follow: twitterConfig.id }, (stream) => {
        stream.on('data', (tweet) => {
          // validating that tweet is not a reply or a RT to ngVenezuelaAccount
          if (tweet.in_reply_to_status_id === null && otherThanMyselfRT(tweet)) {
            this.emit('newTweet', tweet);
          }
        });

        stream.on('error', () => {});
      });
  }
}

module.exports = new TweetEvent();
