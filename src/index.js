const TelegramBot = require('./bot/telegram-bot');
const BotServer = require('./server/bot-server');

const telegramToken = require('./../config/config').telegramToken;
const server = require('./../config/config').server;

const morningEvent = require('./events/morning');
const twitterEvent = require('./events/tweets');
const Superfeedr = require('./events/superfeedr');

const chatUtility = require('./utils/chat');
const blogUtility = require('./utils/blog');
const morningUtility = require('./utils/morning');
const generateRandom = require('./utils/time').generateRandom;
const apiAIUtility = require('./utils/api-ai');
const twitterUtility = require('./utils/tweets');
const githubUtility = require('./utils/github-release');
const devOnlyUtility = require('./utils/dev-only');

const superfeedr = new Superfeedr();
const bot = new TelegramBot(telegramToken);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${server.url}/${telegramToken}`);

// eslint-disable-next-line no-unused-vars
const botServer = new BotServer(`/${bot.token}`, server.port)
 .subscribe(bot)
 .subscribe(superfeedr);

let goodMorningGivenToday = false;
let minuteToCheck = generateRandom(0, 59);

bot
  .onText(/\/groupId/, (msg, match) => devOnlyUtility(bot, msg, match));

bot
  .on('new_chat_participant', msg => chatUtility.sayHello(bot, msg))
  .on('left_chat_participant', msg => chatUtility.sayGoodbye(bot, msg))
  .on('text', (msg) => {
    goodMorningGivenToday =
      chatUtility.checkGoodMorning(goodMorningGivenToday, msg.text);
  })
  .on('text', msg => chatUtility.checkForCode(bot, msg))
  .on('text', msg => apiAIUtility.canBotRespondToThis(bot, msg));

morningEvent
  .on('minuteMark', (vzlanHour, vzlanMinute, weekday) => {
    const executeGoodMorningCheck =
      morningUtility.giveGoodMorning(bot, goodMorningGivenToday, minuteToCheck,
      vzlanHour, vzlanMinute, weekday);

    if (executeGoodMorningCheck.goodMorningGivenToday) {
      goodMorningGivenToday = true;
      minuteToCheck = executeGoodMorningCheck.minuteToCheck;
    }
  })
  .on('newDay', () => {
    goodMorningGivenToday = false;
  });

twitterEvent
  .on('newTweet', tweet => twitterUtility.sendNewTweet(bot, tweet));

superfeedr
  .on('newFeed', feed =>
    githubUtility.checkForRelease('angular/angular', feed)
    && githubUtility.sendRelease(bot, feed, 'angular/angular', true)
  )
  .on('newFeed', feed =>
    githubUtility.checkForRelease('ngVenezuela/wengy-ven', feed)
    && githubUtility.sendRelease(bot, feed, 'ngVenezuela/wengy-ven', false)
  )
  .on('newFeed', feed =>
    blogUtility.checkForBlogEntry(feed) && blogUtility.sendNewBlogEntries(bot, feed));
