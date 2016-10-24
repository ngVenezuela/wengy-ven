'use strict';

const events = require ('events');
let eventEmitter = new events.EventEmitter();

setInterval(emitMinuteMark, 60000);

function emitMinuteMark() {
  let vzlanHour = getVzlanHour();
  let vzlanMinute = getVzlanMinute();

  eventEmitter.emit('minuteMark', vzlanHour, vzlanMinute, getVzlanWeekday());
  if (vzlanHour === 0) {
    eventEmitter.emit('newDay');
  }
}

function getVzlanHour(date = new Date()) {
  let vzlanTime = getVzlanTime(date);
  let vzlanHour = vzlanTime.getUTCHours(); // 24 hours format

  return vzlanHour;
}

function getVzlanMinute(date = new Date()) {
  let vzlanTime = getVzlanTime(date);
  let vzlanMinute = vzlanTime.getUTCMinutes();

  return vzlanMinute;
}

function getVzlanWeekday(date = new Date()) {
  let vzlanTime = getVzlanTime(date);
  let vzlanWeekDay = vzlanTime.getUTCDay(); // sunday = 0

  return vzlanWeekDay;
}

function getVzlanTime(date) {
  const vzlanOffset = 4;
  let actualTime = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      0,0
    )
  );
  let vzlanTimeInMs = actualTime.setUTCHours(date.getUTCHours() - vzlanOffset);
  let vzlanTime = new Date(vzlanTimeInMs);

  return vzlanTime;
}

module.exports = {
  event: eventEmitter,
  getVzlanHour: getVzlanHour
}; 
