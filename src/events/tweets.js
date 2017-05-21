const fs = require('fs');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const Twitter = require('twitter');

const twitterTokens = require('./../../config/config').twitterFeed.auth;
// twitter account to track its tweets
const twitterAccount = require('./../../config/config').twitterFeed.twitterAccount;

// New client to interact with the Twitter API
var twitterClient = new Twitter(twitterTokens);


/**
 * Get the last tracked tweet id registered int the file: last-tweetId.json. 
 * 
 * Note: If there is no file then create it and return false
 * 
 * @return {number} Last Tracked Tweet Id
 *      OR {boolean} false - If there is no last-tweetId.json file
 */
function getLastTrackedTweetId(){
  // Uncomment this line for testing purposes
  return 865304050505576400;
  
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
      fs.writeFileSync('./config/last-tweetId.json','');
      console.log('File not found!... Created');
      return false;
    }
    else
      throw 'Error reading file last-tweetId.json: '+err;
  }
}


/**
 * Check if there are new tweets from ngVenezuela account since the last tracked tweet.
 * 
 * If there is no last tracked tweet registered, save the last tweet id sent by ngVenezuela 
 * in the last-tweetId.json file
 */
function checkNewTweets() {

  // Get the last tracked tweet id
  let lastTrackedTweetId = getLastTrackedTweetId();  

  // No last tracked tweet registered
  if (!lastTrackedTweetId) {
    twitterClient.get('statuses/user_timeline', 
                      {screen_name: twitterAccount, count: 1}, 
                      (error, tweets, response) => {
                        let lastNgTweetId = tweets[0].id;
                        updateLastTrackedTweetId(lastNgTweetId);
                      });
  }else{
    // Get latest tweets since the last tracked tweet registered
    twitterClient.get('statuses/user_timeline', 
                      {screen_name: twitterAccount, since_id: lastTrackedTweetId}, 
                      getLatestTweets);    
  }
}


/**
 * Save the last tweet id sent by ngVenezuela in the last-tweetId.json file
 * 
 * @param  {number} lastTweetId Last tweet id sent by ngVenezuela
 */
function updateLastTrackedTweetId(lastTweetId){
  fs.writeFileSync('./config/last-tweetId.json',`{"lastTweetId":${lastTweetId}}`);
}


/**
 * Callback function when gettting latest tweets since the last tracked tweet registered 
 * 
 * @param  {error}    error    
 * @param  {array}    tweets    Array of tweets object
 * @param  {response} response  HTTP response
 */
function getLatestTweets(error, tweets, response){
  // If there is no tweets then do nothing
  if (tweets.length===0)
    return;

  /**
   * If the last tweet id is the same that the last tracked tweet id, do nothing
   *
   * Note: The Twitter API has a strange behavior, when you use the parameter since_id equal to the most 
   *       recent tweet, it brings you the same tweet... 
   *       But, when you use since_id equal to an older tweet, it doesn't include the since_id tweet
   */
  if (getLastTrackedTweetId()===tweets[0].id)
    return;

  // Update the last tracked tweet id with the last tweet gotten 
  updateLastTrackedTweetId(tweets[0].id);
  
  // Just print the tweets
  tweets.map( tweet => {
    eventEmitter.emit('newTweet', tweet);
  });
}

// Check new tweets every 3 seconds
setInterval(checkNewTweets, 3 * 1000);

module.exports = eventEmitter;