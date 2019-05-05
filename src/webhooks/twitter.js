const { EventEmitter } = require('events');
const crypto = require('crypto');

/**
 * Genereate hash to validate twitter webhook
 * @param {string} crcToken
 * @param {string} twitterConsumerSecretKey
 * @see https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/securing-webhooks.html
 */
const getChallengeResponse = (crcToken, twitterConsumerSecretKey) =>
  crypto
    .createHmac('sha256', twitterConsumerSecretKey)
    .update(crcToken)
    .digest('base64');

/**
 * Class representing an EventEmitter
 * @extends EventEmitter
 */
class Twitter extends EventEmitter {
  verifyMessage(req, res) {
    const crcToken = req.query.crc_token;

    if (crcToken) {
      const { TWITTER_CONSUMER_SECRET } = process.env;
      const hash = getChallengeResponse(crcToken, TWITTER_CONSUMER_SECRET);

      res.status(200);
      res.send({
        response_token: `sha256=${hash}`,
      });
    } else {
      res.status(400);
      res.send('Error: crc_token missing from request.');
    }
  }

  /**
   * Check for twitter-like activity response
   * @param {object} msg
   * @see https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/account-activity-data-objects
   */
  checkMessage(msg) {
    return msg.for_user_id || msg.user_event;
  }

  /**
   * Emit message to subscribers
   * @param {object} msg - Message with tweet info
   */
  processMessage(msg) {
    if (msg.tweet_create_events) {
      this.emit('newTweet', msg.tweet_create_events);
    }
  }
}

module.exports = Twitter;
