const CronJob = require('cron').CronJob;
const { goodMornings } = require('config/messages');
const { mainGroupId } = require('config/telegram');

/**
 * Generate random Integer with values with range: min-max
 * @param {Integer} min - Min value
 * @param {Integer} max - Max value
 * @return {Integer} Random Integer value
 */
const generateRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Get morning message depending
 * on what day of the week it is
 * @param {number} weekday
 * @return {string}
 */
const getMorningMsg = weekday => {
  const weekDays = {
    0: 'generic',
    1: 'mondays',
    2: 'generic',
    3: 'generic',
    4: 'generic',
    5: 'fridays',
    6: 'generic',
  };

  const randomIndex = generateRandom(
    0,
    goodMornings[weekDays[weekday]].length - 1
  );

  return goodMornings[weekDays[weekday]][randomIndex];
};

const handleTimeEvents = bot => {
  new CronJob(
    '0 0 9 * * *',
    () => {
      const now = new Date();
      const morningMessage = getMorningMsg(now.getDay());

      bot.sendMessage(mainGroupId, morningMessage);
    },
    null,
    true,
    'America/Caracas'
  );
};

module.exports = handleTimeEvents;
