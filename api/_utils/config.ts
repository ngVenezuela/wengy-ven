const config = {
  whiteListedDomains: [
    'https://github.com',
    'https://medium.com',
    'https://twitter.com',
  ],
  githubFeeds: [
    {
      name: 'angular',
      repo: 'angular/angular',
      hasChangelog: true,
      feed: 'https://github.com/angular/angular/releases.atom',
    },
    {
      name: 'ionic',
      repo: 'driftyco/ionic',
      hasChangelog: true,
      feed: 'https://github.com/driftyco/ionic/releases.atom',
    },
    {
      name: 'nativescript',
      repo: 'NativeScript/NativeScript',
      hasChangelog: true,
      feed: 'https://github.com/NativeScript/NativeScript/releases.atom',
    },
    {
      name: 'wengy-ven',
      repo: 'ngVenezuela/wengy-ven',
      hasChangelog: true,
      feed: 'https://github.com/ngVenezuela/wengy-ven/releases.atom',
    }
  ],
  blogFeeds: [
    {
      name: 'Blog oficial de ngvenezuela',
      feed: 'https://dev.to/feed/ngvenezuela',
    },
  ]
};

export default config;

