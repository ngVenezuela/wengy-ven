const generateRandom = require('./../utils/time').generateRandom;
const messages = require('./../../config/messages');
const config = require('./../../config/config');
const sendMessage = require('./../utils/message').sendMessage;

const MORNING_HOUR = 7;
const GOOD_MORNING_REG_EXP = new RegExp('buen(os)*\\sd[ií]+as', 'iu');

/**
 * Check if good morning has not
 * been given yet and if it's time
 * to give them
 * @param {boolean} goodMorningGivenToday
 * @param {string} minuteToCheck
 * @param {string} vzlanHour
 * @param {string} vzlanMinute
 * @return {boolean}
 */
const morningConditions = (
  goodMorningGivenToday, minuteToCheck,
  vzlanHour, vzlanMinute
) =>
    !goodMorningGivenToday &&
    vzlanHour === MORNING_HOUR &&
    vzlanMinute === minuteToCheck;

/**
 * Get morning message depending
 * on what day of the week it is
 * @param {number} weekday
 * @return {string}
 */
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

/**
 * Check morning conditions and return object
 * containing if good morning was given today
 * and the minute to be checked
 * @param {object} bot
 * @param {boolean} goodMorningGivenToday
 * @param {string} minuteToCheck
 * @param {string} vzlanHour
 * @param {string} vzlanMinute
 * @param {number} weekday
 * @return {object}
 */
const canBotGiveGoodMorning = (
  bot, goodMorningGivenToday, minuteToCheck,
  vzlanHour, vzlanMinute, weekday
) => {
  if (morningConditions(goodMorningGivenToday, minuteToCheck, vzlanHour, vzlanMinute)) {
    sendMessage(bot, config.community.telegram.groupId, getMorningMsg(weekday));

    return {
      goodMorningGivenToday: true,
      minuteToCheck: generateRandom(0, 59)
    };
  }

  return {
    goodMorningGivenToday,
    minuteToCheck
  };
};

/**
 * Check if good morning was given or if
 * the text match a good morning expression
 * @param {boolean} goodMorningGivenToday
 * @param {string} text
 * @return {boolean}
 */
const checkGoodMorning = (goodMorningGivenToday, text) => {
  if (goodMorningGivenToday) {
    return true;
  }

  return GOOD_MORNING_REG_EXP.test(text);
};

module.exports = {
  canBotGiveGoodMorning,
  checkGoodMorning
};
