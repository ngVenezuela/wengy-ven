'use strict';

const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');
const messages = require('../config/messages');
const morningEvent = require('./morning-event');
const blogEvent = require('./blog-event');
const generateRandom = require('./time-utility').generateRandom;
const fetch = require('node-fetch');

const token = config.telegramToken;
const groupId = config.groupId;
const goodMorningRegExp = config.goodMorningRegExp;

let bot = new TelegramBot(token, {polling: true});
let goodMorningGivenToday = false;
let minuteToCheck = generateRandom(0, 59);

bot
  .on('new_chat_participant', sayHello)
  .on('left_chat_participant', sayGoodbye)
  .on('text', newText);

morningEvent
  .on('minuteMark', (vzlanHour, vzlanMinute, weekday) => {
    if (morningConditions(vzlanHour, vzlanMinute)) {
      goodMorningGivenToday = true;
      minuteToCheck = generateRandom(0, 59);
      bot.sendMessage(
        groupId,
        getMorningMsg(weekday)
      );
    }

    function morningConditions(vzlanHour, vzlanMinute) {
      return !goodMorningGivenToday && vzlanHour === config.morningHour
        && vzlanMinute === minuteToCheck;
    }

    function getMorningMsg(weekday) {
      let weekDays = {
        0: 'generic',
        1: 'mondays',
        2: 'generic',
        3: 'generic',
        4: 'generic',
        5: 'fridays',
        6: 'generic',
      };

      let randomIndex = generateRandom(0, messages.goodMornings[weekDays[weekday]].length - 1);
      return messages.goodMornings[weekDays[weekday]][randomIndex];
    }
  })
  .on('newDay', () => {
    goodMorningGivenToday = false;
  });

blogEvent
  .on('newArticles', (articles) => {
    articles.forEach((article) => {
      bot.sendMessage(
        groupId,
        messages.newBlogPost
          .replace('#{author}', article.author)
          .replace('#{link}', article.link)
          .replace('#{title}', article.title),
        {parse_mode: 'Markdown'}
      );
    });
  });

function formatName(msgContext) {
  return msgContext.username ?
    '@' + msgContext.username : msgContext.first_name;
}

function newText(msg) {
  if (!goodMorningGivenToday && isGoodMorningGiven(msg.text)) {
    goodMorningGivenToday = true;
  }

  function isGoodMorningGiven(text) {
    return goodMorningRegExp.test(text);
  }
}

function sayHello(msg) {
  bot.sendMessage(
    msg.chat.id,
    messages.welcomeMsg.replace('#{name}', formatName(msg.new_chat_member)),
    {reply_to_message_id: msg.message_id, parse_mode: 'Markdown'}
  );
}

function sayGoodbye(msg) {
  bot.sendMessage(
    msg.chat.id,
    messages.goodbyeMsg.replace('#{name}', formatName(msg.left_chat_member)),
    {reply_to_message_id: msg.message_id, parse_mode: 'Markdown'}
  );
}

bot.on('text', (msg) => {
  if ( !msg.hasOwnProperty('entities') ) {
    return;
  }

  if ( msg.entities[0].type !== 'pre' ) {
    return;
  };

  if ( msg.text.length >= 200 ) {
    return;
  }

  const chatId = msg.chat.id;
  const {firstName = '', lastName = '', username = ''} = msg.from;
  const fullName = firstName === '' && lastName === '' ? '' : `${firstName} ${lastName} `;
  const user = username === '' ? '' : `(@${username})`;
  const filename = `${new Date().toISOString()}.js`;
  const gist = msg.text;

  const body = {
    'description': 'gist creado por ' + fullName + user +
      ' para https://t.me/ngvenezuela con https://github.com/ngVenezuela/wengy-ven',
    'public': true,
    'files': {
      [filename]: {
        'content': gist,
      },
    },
  };

  fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( body ),
  })
  .then((response) => response.json())
  .then(({html_url}) => {
    bot.sendMessage(chatId, html_url);
  }).catch(() => {});
});
