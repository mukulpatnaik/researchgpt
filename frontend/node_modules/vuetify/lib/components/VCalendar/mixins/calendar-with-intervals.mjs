// @ts-nocheck
/* eslint-disable */
// Mixins
import CalendarBase from "./calendar-base.mjs"; // Util
import props from "../util/props.mjs";
import { parseTime, copyTimestamp, updateMinutes, createDayList, createIntervalList, createNativeLocaleFormatter, MINUTES_IN_DAY } from "../util/timestamp.mjs";
/* @vue/component */
export default CalendarBase.extend({
  name: 'calendar-with-intervals',
  props: props.intervals,
  computed: {
    parsedFirstInterval() {
      return parseInt(this.firstInterval);
    },
    parsedIntervalMinutes() {
      return parseInt(this.intervalMinutes);
    },
    parsedIntervalCount() {
      return parseInt(this.intervalCount);
    },
    parsedIntervalHeight() {
      return parseFloat(this.intervalHeight);
    },
    parsedFirstTime() {
      return parseTime(this.firstTime);
    },
    firstMinute() {
      const time = this.parsedFirstTime;
      return time !== false && time >= 0 && time <= MINUTES_IN_DAY ? time : this.parsedFirstInterval * this.parsedIntervalMinutes;
    },
    bodyHeight() {
      return this.parsedIntervalCount * this.parsedIntervalHeight;
    },
    days() {
      return createDayList(this.parsedStart, this.parsedEnd, this.times.today, this.weekdaySkips, this.maxDays);
    },
    intervals() {
      const days = this.days;
      const first = this.firstMinute;
      const minutes = this.parsedIntervalMinutes;
      const count = this.parsedIntervalCount;
      const now = this.times.now;
      return days.map(d => createIntervalList(d, first, minutes, count, now));
    },
    intervalFormatter() {
      if (this.intervalFormat) {
        return this.intervalFormat;
      }
      const longOptions = {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit'
      };
      const shortOptions = {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: '2-digit'
      };
      const shortHourOptions = {
        timeZone: 'UTC',
        hour: 'numeric'
      };
      return createNativeLocaleFormatter(this.currentLocale, (tms, short) => short ? tms.minute === 0 ? shortHourOptions : shortOptions : longOptions);
    }
  },
  methods: {
    showIntervalLabelDefault(interval) {
      const first = this.intervals[0][0];
      const isFirst = first.hour === interval.hour && first.minute === interval.minute;
      return !isFirst;
    },
    intervalStyleDefault(_interval) {
      return undefined;
    },
    getTimestampAtEvent(e, day) {
      const timestamp = copyTimestamp(day);
      const bounds = e.currentTarget.getBoundingClientRect();
      const baseMinutes = this.firstMinute;
      const touchEvent = e;
      const mouseEvent = e;
      const touches = touchEvent.changedTouches || touchEvent.touches;
      const clientY = touches && touches[0] ? touches[0].clientY : mouseEvent.clientY;
      const addIntervals = (clientY - bounds.top) / this.parsedIntervalHeight;
      const addMinutes = Math.floor(addIntervals * this.parsedIntervalMinutes);
      const minutes = baseMinutes + addMinutes;
      return updateMinutes(timestamp, minutes, this.times.now);
    },
    getSlotScope(timestamp) {
      const scope = copyTimestamp(timestamp);
      scope.timeToY = this.timeToY;
      scope.timeDelta = this.timeDelta;
      scope.minutesToPixels = this.minutesToPixels;
      scope.week = this.days;
      return scope;
    },
    scrollToTime(time) {
      const y = this.timeToY(time);
      const pane = this.$refs.scrollArea;
      if (y === false || !pane) {
        return false;
      }
      pane.scrollTop = y;
      return true;
    },
    minutesToPixels(minutes) {
      return minutes / this.parsedIntervalMinutes * this.parsedIntervalHeight;
    },
    timeToY(time) {
      let clamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      let y = this.timeDelta(time);
      if (y !== false) {
        y *= this.bodyHeight;
        if (clamp) {
          if (y < 0) {
            y = 0;
          }
          if (y > this.bodyHeight) {
            y = this.bodyHeight;
          }
        }
      }
      return y;
    },
    timeDelta(time) {
      const minutes = parseTime(time);
      if (minutes === false) {
        return false;
      }
      const min = this.firstMinute;
      const gap = this.parsedIntervalCount * this.parsedIntervalMinutes;
      return (minutes - min) / gap;
    }
  }
});
//# sourceMappingURL=calendar-with-intervals.mjs.map