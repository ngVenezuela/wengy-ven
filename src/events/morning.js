const EventEmitter = require('events').EventEmitter;
const timeUtility = require('./../utils/time');

/**
 * Class representing an EventEmitter
 * @extends EventEmitter
 */
class MorningEvent extends EventEmitter {
  /**
   * Creates an instance of EventEmitter
   */
  constructor() {
    super();

    /**
     * This function emits an event
     * with the current hour/minute &
     * it also emits an event when it's
     * a new day
     */
    const emitMinuteMark = () => {
      const vzlanHour = timeUtility.vzlanHour();
      const vzlanMinute = timeUtility.vzlanMinute();

      this.emit(
        'minuteMark',
        vzlanHour,
        vzlanMinute,
        timeUtility.vzlanWeekday()
      );
      if (vzlanHour === 0 && vzlanMinute === 0) {
        this.emit('newDay');
      }
    };

    setInterval(emitMinuteMark, 60 * 1000); // 60 seconds
  }
}

module.exports = new MorningEvent();
