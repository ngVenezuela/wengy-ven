/**
 * Generate random Integer with values with range: min-max
 * @param {Integer} min - Min value
 * @param {Integer} max - Max value
 * @return {Integer} Random Integer value
 */
const generateRandom = (min, max) =>
  Math.floor(Math.random() * ((max - min) + 1)) + min;

/**
 * Get date in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Date} date in Venezuela
 */
const getVzlanTime = (date) => {
  const vzlanOffset = 4;
  const actualTime = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      0,
      0
    )
  );
  const vzlanTimeInMs = actualTime.setUTCHours(date.getUTCHours() - vzlanOffset);
  const vzlanTime = new Date(vzlanTimeInMs);

  return vzlanTime;
};


/**
 * Get hour in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Integer} Hour in Venezuela
 */
const vzlanHour = (date = new Date()) => {
  const vzlanTime = getVzlanTime(date);
  const venezuelanHour = vzlanTime.getUTCHours(); // 24 hours format (0-23)

  return venezuelanHour;
};

/**
 * Get minute in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Integer} minute in Venezuela
 */
const vzlanMinute = (date = new Date()) => {
  const vzlanTime = getVzlanTime(date);
  const venezuelanMinute = vzlanTime.getUTCMinutes(); // 0-59

  return venezuelanMinute;
};

/**
 * Get weekday in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Integer} weekday in Venezuela
 */
const vzlanWeekday = (date = new Date()) => {
  const vzlanTime = getVzlanTime(date);
  const venezuelanWeekDay = vzlanTime.getUTCDay(); // sunday = 0

  return venezuelanWeekDay;
};

module.exports = {
  vzlanHour,
  vzlanMinute,
  vzlanWeekday,
  generateRandom
};

