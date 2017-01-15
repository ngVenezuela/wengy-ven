'use strict';

module.exports = {
  vzlanHour: vzlanHour,
  vzlanMinute: vzlanMinute,
  vzlanWeekday: vzlanWeekday,
};

/**
 * Get hour in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Integer} Hour in Venezuela
 */
function vzlanHour(date = new Date()) {
  let vzlanTime = getVzlanTime(date);
  let vzlanHour = vzlanTime.getUTCHours(); // 24 hours format (0-23)

  return vzlanHour;
}

/**
 * Get minute in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Integer} minute in Venezuela
 */
function vzlanMinute(date = new Date()) {
  let vzlanTime = getVzlanTime(date);
  let vzlanMinute = vzlanTime.getUTCMinutes(); // 0-59

  return vzlanMinute;
}

/**
 * Get weekday in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Integer} weekday in Venezuela
 */
function vzlanWeekday(date = new Date()) {
  let vzlanTime = getVzlanTime(date);
  let vzlanWeekDay = vzlanTime.getUTCDay(); // sunday = 0

  return vzlanWeekDay;
}

/**
 * Get date in Venezuela, given a date
 * @param {Date} date - Date
 * @return {Date} date in Venezuela
 */
function getVzlanTime(date) {
  const vzlanOffset = 4;
  let actualTime = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      0, 0
    )
  );
  let vzlanTimeInMs = actualTime.setUTCHours(date.getUTCHours() - vzlanOffset);
  let vzlanTime = new Date(vzlanTimeInMs);

  return vzlanTime;
}
