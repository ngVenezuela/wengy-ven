const events = require('events');
const timeUtility = require('./../utils/time');

const eventEmitter = new events.EventEmitter();

/**
 * this function emits an event
 * with the current hour/minute &
 * it also emits an event when it's
 * a new day
 */
function emitMinuteMark() {
  const vzlanHour = timeUtility.vzlanHour();
  const vzlanMinute = timeUtility.vzlanMinute();

  eventEmitter.emit(
    'minuteMark',
    vzlanHour,
    vzlanMinute,
    timeUtility.vzlanWeekday()
  );
  if (vzlanHour === 0 && vzlanMinute === 0) {
    eventEmitter.emit('newDay');
  }
}

setInterval(emitMinuteMark, 60 * 1000); // 60 seconds

module.exports = eventEmitter;
