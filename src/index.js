const redis = require('redis');
const bluebird = require('bluebird');
const redisOptions = require('./../config/config').redisOptions;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(redisOptions);

const TelegramBot = require('./bot/telegram-bot');
const BotServer = require('./server/bot-server');

const telegramToken = require('./../config/config').telegramToken;
const server = require('./../config/config').server;

const morningEvent = require('./events/morning');
const TwitterEvent = require('./events/tweets');
const Superfeedr = require('./events/superfeedr');

const chatUtility = require('./utils/chat');
const blogUtility = require('./utils/blog');
const morningUtility = require('./utils/morning');
const generateRandom = require('./utils/time').generateRandom;
const apiAIUtility = require('./utils/api-ai');
const twitterUtility = require('./utils/tweets');
const githubUtility = require('./utils/github-release');
const devUtility = require('./utils/dev-only');
const commandUtility = require('./utils/command');

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
        commandUtility.verifyCommand(redisClient, match, msg.from.id)
          .then((canExecuteCommand) => {
            if (canExecuteCommand) {
              devUtility.sendGroupId(bot, msg.chat.id, match[0]);
            }
          })
          .catch(() => {}));

    bot
      .on('new_chat_participant', msg => chatUtility.sayHello(bot, msg))
      .on('left_chat_participant', msg => chatUtility.sayGoodbye(bot, msg))
      .on('text', (msg) => {
        goodMorningGivenToday =
          chatUtility.checkGoodMorning(goodMorningGivenToday, msg.text);
      })
      .on('text', msg => chatUtility.checkForCode(bot, msg, redisClient))
      .on('text', msg => apiAIUtility.canBotRespondToThis(bot, msg, redisClient));
  })
  .on('error', () => {});

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

new TwitterEvent()
  .on('newTweet', tweet => twitterUtility.sendNewTweet(bot, tweet));

superfeedr
  .on('newFeed', feed => githubUtility.checkAndSendRelease(bot, feed))
  .on('newFeed', feed => blogUtility.checkAndSendBlogEntry(bot, feed));
