const events = require('events');
const twitterTokens = require('./../../config/config').twitterTokens;
const fs = require('fs');
const eventEmitter = new events.EventEmitter();


var Twitter = require('twitter');

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
                      {screen_name: 'ngVenezuela', count: 1}, 
                      (error, tweets, response) => {
                        let lastNgTweetId = tweets[0].id;
                        updateLastTrackedTweetId(lastNgTweetId);
                      });
  }else{
    // Get latest tweets since the last tracked tweet registered
    twitterClient.get('statuses/user_timeline', 
                      {screen_name: 'BikeCoders', since_id: lastTrackedTweetId}, 
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
  //eventEmitter.emit('newDay');
  
  /**
   * Get the last tweets includes the last tweet already already tracked, 
   * we need to ignore it.
   */
  tweets.pop();

  // If there is no tweets then do nothing
  if (tweets.length===0)
    return;

  // Update the last tracked tweet id with the last tweet gotten 
  updateLastTrackedTweetId(tweets[0].id);
  
  // Just print the tweets
  tweets.map( tweet => {
    console.log(tweet.text, '---id: ',tweet.id);
  });
}

// Check new tweets every 3 seconds
setInterval(checkNewTweets, 3 * 1000);

module.exports = eventEmitter;