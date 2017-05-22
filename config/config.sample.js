const uuidV4 = require('uuid/v4');

const config = {
  telegramToken: 'MY_SUPER_SECRET_TELEGRAM_TOKEN',
  morningHour: 7,
  groupId: -1001031605415,
  // groupId: -165387746 //test group,
  botUsername: 'WengyBot',
  // botUsername: 'LeoTestsBot', // test bot username
  apiAI: {
    lang: 'es',
    sessionId: uuidV4(),
    queryUrl: 'https://api.api.ai/v1/query?v=20150910',
    clientAccessToken: 'MY_SUPER_SECRET_APIAI_TOKEN'
  },
  goodMorningRegExp: new RegExp('buen(os)*\\sd[ií]+as', 'iu'),
  blogFeedUrl: 'https://medium.com/feed/ngvenezuela',
  server: {
    url: 'MY_HTTPS_SERVER', // ej: 'https://9c386d7d.ngrok.io'
    port: 'MY_PORT'
  },
  twitterFeed: {
    // Create these keys here: https://apps.twitter.com/
    auth: {
      consumer_key: 'CONSUMER_KEY',
      consumer_secret: 'CONSUMER_SECRET',
      access_token_key: 'ACCESS_TOKEN_KEY',
      access_token_secret: 'ACCESS_TOKEN_SECRET'
    },
    twitterAccount: 'ngVenezuela',
    hashtagMessage: '#ngVenezuelaTweet'
  }
};

module.exports = config;
