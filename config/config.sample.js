const config = {
  community: {
    telegram: {
      link: 'https://t.me/ngvenezuela',
      botUsername: process.env.botUsername || 'WengyBot',
      botToken: process.env.botToken || 'MY_SUPER_SECRET_TELEGRAM_TOKEN',
      groupId: process.env.botGroupId || '-1001031605415',
      adminGroupId: process.env.botAdminGroupId || '-241180414'
    },
    github: 'https://github.com/ngVenezuela/wengy-ven',
    blogFeedUrl: 'https://medium.com/feed/ngvenezuela'
  },
  server: {
    url: process.env.serverUrl || 'MY_HTTPS_SERVER',
    port: process.env.serverPort || 'MY_PORT'
  },
  redisOptions: {
    host: process.env.redisUrl || 'localhost',
    port: process.env.redisPort || '6379',
    enableReadyCheck: true
  },
  integrations: {
    apiAI: {
      lang: 'es',
      queryUrl: 'https://api.api.ai/v1/query?v=20150910',
      clientAccessToken: process.env.apiAiClientAccessToken
    },
    twitter: {
      auth: {
        consumerKey: process.env.twitterConsumerKey,
        consumerSecret: process.env.twitterConsumerSecret,
        accessTokenKey: process.env.twitterAccessTokenKey,
        accessTokenSecret: process.env.twitterAccessTokenSecret
      },
      id: process.env.twitterId || '41469246',
      hashtagMessage: '#ngVenezuelaTweet'
    },
    github: {
      accessToken: process.env.githubAccessToken
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
        hasChangelog: true,
        feed: 'https://github.com/ngVenezuela/wengy-ven/releases.atom'
      }
    ],
    sentryDnsKey: process.env.sentryDnsKey || ''
  },
  whiteListedDomains: [
    'https://github.com',
    'https://medium.com',
    'https://twitter.com'
  ]
};

module.exports = config;
