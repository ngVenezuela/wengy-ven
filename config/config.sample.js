const uuidV4 = require('uuid/v4');

const config = {
  telegramToken: 'MY_SUPER_SECRET_TELEGRAM_TOKEN',
  botUsername: 'WengyBot',
  server: {
    url: 'MY_HTTPS_SERVER',
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
      id: '41469246',
      hashtagMessage: '#ngVenezuelaTweet'
    },
    githubReleases: [
      {
        name: 'angular',
        repo: 'angular/angular',
        hasChangelog: true,
        feed: 'https://github.com/angular/angular/releases.atom'
      },
      {
        name: 'ionic',
        repo: 'driftyco/ionic',
        hasChangelog: true,
        feed: 'https://github.com/driftyco/ionic/releases.atom'
      },
      {
        name: 'nativescript',
        repo: 'NativeScript/NativeScript',
        hasChangelog: true,
        feed: 'https://github.com/NativeScript/NativeScript/releases.atom'
      },
      {
        name: 'wengy-ven',
        repo: 'ngVenezuela/wengy-ven',
        hasChangelog: false,
        feed: 'https://github.com/ngVenezuela/wengy-ven/releases.atom'
      }
    ]
  }
};

module.exports = config;
