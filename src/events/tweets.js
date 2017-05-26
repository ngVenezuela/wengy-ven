const fs = require('fs');
const events = require('events');
const Twitter = require('twitter');

const eventEmitter = new events.EventEmitter();
const twitterConfig = require('./../../config/config').integrations.twitter;

const twitterTokens = twitterConfig.auth;
const twitterAccount = twitterConfig.account;
const twitterClient = new Twitter({
  consumer_key: twitterTokens.consumerKey,
  consumer_secret: twitterTokens.consumerSecret,
  access_token_key: twitterTokens.accessTokenKey,
  access_token_secret: twitterTokens.accessTokenSecret
});

/**
 * Get the last tracked tweet id registered int the file: last-tweetId.json.
 *
 * Note: If there is no file then create it and return false
 *
 * @return {number} Last Tracked Tweet Id
 *      OR {boolean} false - If there is no last-tweetId.json file
 */
function getLastTrackedTweetId() {
  try {
    // Read the last-tweetId.json to get the last tracked tweet id
    const data = fs.readFileSync('./config/last-tweetId.json', 'utf8');
    const parsed = JSON.parse(data);

    return parsed.lastTweetId;
  } catch (err) {
    /**
     * If the file doesn't exist, create the file and return false because there is no last
     * tweet tracked
     */
    if (err.code === 'ENOENT') {
      fs.writeFileSync('./config/last-tweetId.json', '{}');
      return false;
    }

    throw new Error(`Error reading file last-tweetId.json: ${err}`);
  }
}

/**
 * Save the last tweet id sent by ngVenezuela in the last-tweetId.json file
 *
 * @param  {number} lastTweetId Last tweet id sent by ngVenezuela
 */
function updateLastTrackedTweetId(lastTweetId) {
  fs.writeFileSync('./config/last-tweetId.json', `{"lastTweetId":${lastTweetId}}`);
}

/**
 * Callback function when gettting latest tweets since the last tracked tweet registered
 *
 * @param  {error}    error
 * @param  {array}    tweets    Array of tweets object
 * @param  {response} response  HTTP response
 */
function getLatestTweets(error, tweets) {
  // If error getting tweets then do nothing
  if (error !== null) {
    return;
  }

  // If there is no tweets then do nothing
  if (tweets.length === 0) {
    return;
  }

  /**
   * If the last tweet id is the same that the last tracked tweet id, do nothing
   *
   * Note: The Twitter API has a strange behavior,
   * when you use the parameter since_id equal to the most
   * recent tweet, it brings you the same tweet...
   * But, when you use since_id equal to an older tweet,
   * it doesn't include the since_id tweet
   */
  if (getLastTrackedTweetId() === tweets[0].id) {
    return;
  }

  // Update the last tracked tweet id with the last tweet gotten
  updateLastTrackedTweetId(tweets[0].id);

  tweets.map(tweet => eventEmitter.emit('newTweet', tweet));
}

/**
 * Check if there are new tweets from ngVenezuela account since the last tracked tweet.
 *
 * If there is no last tracked tweet registered, save the last tweet id sent by ngVenezuela
 * in the last-tweetId.json file
 */
function checkNewTweets() {
  // Get the last tracked tweet id
  const lastTrackedTweetId = getLastTrackedTweetId();

  if (lastTrackedTweetId) {
    twitterClient.get(
      'statuses/user_timeline',
      { screen_name: twitterAccount, since_id: lastTrackedTweetId },
      getLatestTweets
    );
  } else {
    // No last tracked tweet registered
    // Get latest tweets since the last tracked tweet registered
    twitterClient.get(
      'statuses/user_timeline',
      { screen_name: twitterAccount, count: 1 },
      (error, tweets) => {
        if (error === null && tweets.length > 0) {
          updateLastTrackedTweetId(tweets[0].id);
        }
      }
    );
  }
}

if (twitterConfig) {
  setInterval(checkNewTweets, 60 * 1000); // 60 seconds
}

module.exports = eventEmitter;
