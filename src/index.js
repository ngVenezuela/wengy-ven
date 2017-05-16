const TelegramBot = require('node-telegram-bot-api');
const BotServer = require('./server/BotServer');
const telegramToken = require('./../config/config').telegramToken;
const server = require('./../config/config').server;
const morningEvent = require('./events/morning');
const blogEvent = require('./events/blog');
const chatUtility = require('./utils/chat');
const blogUtility = require('./utils/blog');
const morningUtility = require('./utils/morning');
const generateRandom = require('./utils/time').generateRandom;
const apiAIUtility = require('./utils/api-ai');

const bot = new TelegramBot(telegramToken);
const botServer = new BotServer(bot, server.port);
let goodMorningGivenToday = false;
let minuteToCheck = generateRandom(0, 59);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${server.url}/${telegramToken}`);

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

    goodMorningGivenToday = executeGoodMorningCheck.goodMorningGivenToday;
    minuteToCheck = executeGoodMorningCheck.minuteToCheck;
  })
  .on('newDay', () => {
    goodMorningGivenToday = false;
  });

blogEvent
  .on('newArticles', articles => blogUtility.sendNewArticles(bot, articles));
