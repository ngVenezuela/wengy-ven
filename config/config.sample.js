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
};

module.exports = config;
