const uuidV4 = require('uuid/v4');

const config = {
  telegramToken: 'MY_SUPER_SECRET_TELEGRAM_TOKEN',
  botUsername: 'WengyBot',
  server: {
    url: 'MY_HTTPS_SERVER', // ej: 'https://9c386d7d.ngrok.io'
    port: 'MY_PORT'
  },
  groupId: -1001031605415,
  morningHour: 7,
  goodMorningRegExp: new RegExp('buen(os)*\\sd[ií]+as', 'iu'),
  blogFeedUrl: 'https://medium.com/feed/ngvenezuela',
  integrations: {
    apiAI: {
      lang: 'es',
      sessionId: uuidV4(),
      queryUrl: 'https://api.api.ai/v1/query?v=20150910',
      clientAccessToken: 'MY_SUPER_SECRET_APIAI_TOKEN'
    },
    twitter: {
      auth: {
        consumerKey: 'CONSUMER_KEY',
        consumerSecret: 'CONSUMER_SECRET',
        accessTokenKey: 'ACCESS_TOKEN_KEY',
        accessTokenSecret: 'ACCESS_TOKEN_SECRET'
      },
      account: 'ngVenezuela',
      hashtagMessage: '#ngVenezuelaTweet'
    }
  }
};

module.exports = config;
