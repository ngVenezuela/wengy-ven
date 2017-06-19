const config = {
  community: {
    telegram: {
      link: 'https://t.me/ngvenezuela',
      botUsername: process.env.botUsername || 'WengyBot',
      botToken: process.env.botToken || 'MY_SUPER_SECRET_TELEGRAM_TOKEN',
      groupId: process.env.botGroupId || -1001031605415
    },
    github: 'https://github.com/ngVenezuela/wengy-ven',
    blogFeedUrl: 'https://medium.com/feed/ngvenezuela'
  },
  server: {
    url: process.env.serverUrl || 'MY_HTTPS_SERVER',
    port: process.env.serverPort || 'MY_PORT'
  },
  redisOptions: {
    url: 'MY_REDIS_SERVER',
    port: 'MY_REDIS_PORT'
  },
  integrations: {
    apiAI: {
      lang: 'es',
      queryUrl: 'https://api.api.ai/v1/query?v=20150910',
      clientAccessToken: process.env.apiAiClientAccessToken || 'MY_SUPER_SECRET_APIAI_TOKEN'
    },
    twitter: {
      auth: {
        consumerKey: process.env.twitterConsumerKey || 'CONSUMER_KEY',
        consumerSecret: process.env.twitterConsumerSecret || 'CONSUMER_SECRET',
        accessTokenKey: process.env.twitterAccessTokenKey || 'ACCESS_TOKEN_KEY',
        accessTokenSecret: process.twitterAccessTokenSecret || 'ACCESS_TOKEN_SECRET'
      },
      id: process.env.twitterId || '41469246',
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
