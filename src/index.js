const redis = require('redis');
const bluebird = require('bluebird');
const redisOptions = require('./../config/config').redisOptions;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(redisOptions);

const TelegramBot = require('./bot/telegram-bot');
const BotServer = require('./server/bot-server');

const telegramToken = require('./../config/config').community.telegram.botToken;
const server = require('./../config/config').server;

const morningEvent = require('./events/morning');
const newTweet = require('./events/tweets');
const Superfeedr = require('./events/superfeedr');

const chatUtility = require('./utils/chat');
const blogUtility = require('./utils/blog');
const morningUtility = require('./utils/morning');
const generateRandom = require('./utils/time').generateRandom;
const apiAIUtility = require('./utils/api-ai');
const twitterUtility = require('./utils/tweets');
const githubUtility = require('./utils/github');
const devUtility = require('./utils/dev-only');

const superfeedr = new Superfeedr();
const bot = new TelegramBot(telegramToken);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${server.url}/${telegramToken}`);

new BotServer(`/${bot.token}`, server.port)
  .subscribe(bot)
  .subscribe(superfeedr);

let goodMorningGivenToday = false;
let minuteToCheck = generateRandom(0, 59);

redisClient
  .on('ready', () => {
    bot
      .onText(/\/groupId/, (msg, match) =>
        devUtility.sendGroupId(bot, msg.chat.id, msg.from.id, match[0], redisClient));
    bot
      .onText(/\/comunidades/, (msg, match) =>
        githubUtility.sendOpenVeGithubLink(bot, msg, match[0], redisClient));

    bot
      .onText(/\/github/, (msg, match) =>
        githubUtility.sendCommunityRepo(bot, msg, match[0], redisClient));

    bot
      .on('new_chat_participant', msg => chatUtility.sayHello(bot, msg))
      .on('left_chat_participant', msg => chatUtility.sayGoodbye(bot, msg))
      .on('text', (msg) => {
        goodMorningGivenToday =
          morningUtility.checkGoodMorning(goodMorningGivenToday, msg.text);
      })
      .on('text', msg => githubUtility.checkForCode(bot, msg, redisClient))
      .on('text', msg => apiAIUtility.canBotRespondToThis(bot, msg, redisClient));
  })
  .on('error', () => {});

morningEvent
  .on('minuteMark', (vzlanHour, vzlanMinute, weekday) => {
    const executeGoodMorningCheck =
      morningUtility.canBotGiveGoodMorning(bot, goodMorningGivenToday, minuteToCheck,
      vzlanHour, vzlanMinute, weekday);

    if (executeGoodMorningCheck.goodMorningGivenToday) {
      goodMorningGivenToday = true;
      minuteToCheck = executeGoodMorningCheck.minuteToCheck;
    }
  })
  .on('newDay', () => {
    goodMorningGivenToday = false;
  });

newTweet
  .on('newTweet', tweet => twitterUtility.sendNewTweet(bot, tweet));

superfeedr
  .on('newFeed', feed => githubUtility.checkAndSendRelease(bot, feed))
  .on('newFeed', feed => blogUtility.checkAndSendBlogEntry(bot, feed));
