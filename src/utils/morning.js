const generateRandom = require('./../utils/time').generateRandom;
const messages = require('./../../config/messages');
const config = require('./../../config/config');
const sendMessage = require('./../utils/send-message');

function morningConditions(goodMorningGivenToday, minuteToCheck, vzlanHour, vzlanMinute) {
  return (
    !goodMorningGivenToday &&
    vzlanHour === config.morningHour &&
    vzlanMinute === minuteToCheck
  );
}

function getMorningMsg(weekday) {
  const weekDays = {
    0: 'generic',
    1: 'mondays',
    2: 'generic',
    3: 'generic',
    4: 'generic',
    5: 'fridays',
    6: 'generic'
  };

  const randomIndex = generateRandom(
    0,
    messages.goodMornings[weekDays[weekday]].length - 1
  );

  return messages.goodMornings[weekDays[weekday]][randomIndex];
}


function giveGoodMorning(bot, goodMorningGivenToday,
  minuteToCheck, vzlanHour, vzlanMinute, weekday) {
  if (morningConditions(goodMorningGivenToday, minuteToCheck, vzlanHour, vzlanMinute)) {
    sendMessage(bot, config.groupId, getMorningMsg(weekday));
    return {
      goodMorningGivenToday: true,
      minuteToCheck: generateRandom(0, 59)
    };
  }

  return {
    goodMorningGivenToday: false,
    minuteToCheck
  };
}

module.exports = {
  giveGoodMorning
};
