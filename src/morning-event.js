'use strict';

const events = require('events');
const timeUtility = require('./time-utility.js');
let eventEmitter = new events.EventEmitter();

setInterval(emitMinuteMark, 60000); // 60 seconds

module.exports = eventEmitter;

/**
 * this function emits an event
 * with the current hour/minute &
 * it also emits an event when it's
 * a new day
 */
function emitMinuteMark() {
  let vzlanHour = timeUtility.vzlanHour();
  let vzlanMinute = timeUtility.vzlanMinute();

  eventEmitter.emit('minuteMark', vzlanHour, vzlanMinute, timeUtility.vzlanWeekday());
  if (vzlanHour === 0 && vzlanMinute == 0) {
    eventEmitter.emit('newDay');
  }
}
