'use strict';

const telegramBot = require('node-telegram-bot-api');
const config =  require('../config/config');
const messages =  require('../config/messages');
const morningEvent = require('./morning-event');

const token = config.telegramToken;
// const groupId = -165387746; //test group
const groupId = -1001031605415;
const goodMorningRegExp = new RegExp('buen(os)*\\sd[ií]+as', 'iu');
let bot = new telegramBot(token, {polling: true});
let goodMorningGivenToday = false;
let minuteToCheck = generateRandom(0, 59);

bot
  .on('new_chat_participant', newChatParticipant)
  .on('text', newText);

morningEvent.event
  .on('minuteMark', function(vzlanHour, vzlanMinute, weekday) {
    if (morningConditions(vzlanHour, vzlanMinute)) {
      goodMorningGivenToday = true;
      minuteToCheck = generateRandom(0, 59);
      bot.sendMessage(
        groupId,
        getMorningMsg(weekday)
      );
    }

    function morningConditions(vzlanHour, vzlanMinute) {
      return !goodMorningGivenToday && vzlanHour === 7 && vzlanMinute === minuteToCheck;
    }

    function getMorningMsg(weekday) {
      weekdayInLetters = 'generic';
      if (weekday === 1) {
        weekdayInLetters = 'mondays';
      } else if (weekday === 5) {
        weekdayInLetters = 'fridays';
      }

      let randomIndex = generateRandom(0, messages.goodMornings[weekdayInLetters].length - 1);
      return messages.goodMornings[weekdayInLetters][randomIndex];
    }
  })
  .on('newDay', function() {
    goodMorningGivenToday = false;
  });

function newText(msg) {
  if (!goodMorningGivenToday && isGoodMorningGiven(msg.text)) {
    goodMorningGivenToday = true;
  } 

  function isGoodMorningGiven(text) {
    return goodMorningRegExp.test(text);
  }
}

function newChatParticipant(msg) {
  bot.sendMessage(
    msg.chat.id,
    getFullWelcomeMsg(msg),
    {reply_to_message_id: msg.message_id, parse_mode: 'Markdown'}
  );

  function getFullWelcomeMsg(msg) {
    let nameToBeShown = msg.new_chat_member.first_name;

    if (msg.new_chat_member.username) {
      nameToBeShown = '@' + msg.new_chat_member.username;
    } else if (msg.new_chat_member.hasOwnProperty('last_name')) {
      nameToBeShown = nameToBeShown + ' ' + msg.new_chat_member.last_name;
    }

    return messages.welcomeMsg.replace('#{name}', nameToBeShown);
  }
}

function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
