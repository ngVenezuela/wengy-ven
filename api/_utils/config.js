/**
 * About feeds:
 * Superfeedr free plan only support up to 10 feeds
 * in the free tier: https://superfeedr.com/subscriber#pricing
 */

const config = {
  whiteListedDomains: [
    'https://github.com',
    'https://dev.to',
    'https://twitter.com',
  ],
  githubFeeds: [
    {
      name: 'angular',
      hasChangelog: true,
      feed: 'https://github.com/angular/angular/releases.atom',
    },
    {
      name: 'ionic',
      hasChangelog: true,
      feed: 'https://github.com/driftyco/ionic/releases.atom',
    },
    {
      name: 'nativescript',
      hasChangelog: true,
      feed:
        'https://github.com/NativeScript/NativeScript/releases.atom',
    },
    {
      name: 'wengy-ven',
      hasChangelog: true,
      feed: 'https://github.com/ngVenezuela/wengy-ven/releases.atom',
    },
    {
      name: 'ngrx',
      hasChangelog: true,
      feed: 'https://github.com/ngrx/platform/releases.atom',
    },
    {
      name: 'TypeScript',
      hasChangelog: false,
      feed: 'https://github.com/Microsoft/TypeScript/releases.atom',
    },
    {
      name: 'nx',
      hasChangelog: false,
      feed: 'https://github.com/nrwl/nx/releases.atom',
    },
  ],
  blogFeeds: [
    {
      name: 'Blog oficial de ngvenezuela',
      feed: 'https://dev.to/feed/ngvenezuela',
    },
    {
      name: 'Angular blog',
      feed: 'https://blog.angular.io/feed',
    },
  ],
};

/* we are requiring this in an env where import/export are not supported */
module.exports = config;
