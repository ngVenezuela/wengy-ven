const { MAIN_GROUP_ID, ADMIN_GROUP_ID } = process.env;

module.exports = {
  mainGroupId: MAIN_GROUP_ID,
  adminGroupId: ADMIN_GROUP_ID,
  whiteListedDomains: [
    'https://github.com',
    'https://medium.com',
    'https://twitter.com',
  ],
  feeds: [
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
    },
    {
      name: 'blog',
      feed: 'https://medium.com/feed/ngvenezuela',
    },
  ],
};
