const generateRandom = require('./../utils/time').generateRandom;
const messages = require('./../../config/messages');
const config = require('./../../config/config');
const sendMessage = require('./../utils/send-message');

const MORNING_HOUR = 7;
const GOOD_MORNING_REG_EXP = new RegExp('buen(os)*\\sd[ií]+as', 'iu');

const morningConditions = (goodMorningGivenToday, minuteToCheck, vzlanHour, vzlanMinute) =>
    !goodMorningGivenToday &&
    vzlanHour === MORNING_HOUR &&
    vzlanMinute === minuteToCheck;

const getMorningMsg = (weekday) => {
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
};


const canBotGiveGoodMorning = (bot, goodMorningGivenToday,
  minuteToCheck, vzlanHour, vzlanMinute, weekday) => {
  if (morningConditions(goodMorningGivenToday, minuteToCheck, vzlanHour, vzlanMinute)) {
    sendMessage(bot, config.community.telegram.groupId, getMorningMsg(weekday));
    return {
      goodMorningGivenToday: true,
      minuteToCheck: generateRandom(0, 59)
    };
  }

  return {
    goodMorningGivenToday: false,
    minuteToCheck
  };
};

const checkGoodMorning = (goodMorningGivenToday, text) =>
  !goodMorningGivenToday && GOOD_MORNING_REG_EXP.test(text);

module.exports = {
  canBotGiveGoodMorning,
  checkGoodMorning
};
