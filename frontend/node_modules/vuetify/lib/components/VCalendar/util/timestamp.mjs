// @ts-nocheck
/* eslint-disable */
import { isLeapYear } from "../../../util/dateTimeUtils.mjs";
export const PARSE_REGEX = /^(\d{4})-(\d{1,2})(-(\d{1,2}))?([^\d]+(\d{1,2}))?(:(\d{1,2}))?(:(\d{1,2}))?$/;
export const PARSE_TIME = /(\d\d?)(:(\d\d?)|)(:(\d\d?)|)/;
export const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const DAYS_IN_MONTH_LEAP = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const DAYS_IN_MONTH_MIN = 28;
export const DAYS_IN_MONTH_MAX = 31;
export const MONTH_MAX = 12;
export const MONTH_MIN = 1;
export const DAY_MIN = 1;
export const DAYS_IN_WEEK = 7;
export const MINUTES_IN_HOUR = 60;
export const MINUTE_MAX = 59;
export const MINUTES_IN_DAY = 24 * 60;
export const HOURS_IN_DAY = 24;
export const HOUR_MAX = 23;
export const FIRST_HOUR = 0;
export const OFFSET_YEAR = 10000;
export const OFFSET_MONTH = 100;
export const OFFSET_HOUR = 100;
export const OFFSET_TIME = 10000;
export function getStartOfWeek(timestamp, weekdays, today) {
  const start = copyTimestamp(timestamp);
  findWeekday(start, weekdays[0], prevDay);
  updateFormatted(start);
  if (today) {
    updateRelative(start, today, start.hasTime);
  }
  return start;
}
export function getEndOfWeek(timestamp, weekdays, today) {
  const end = copyTimestamp(timestamp);
  findWeekday(end, weekdays[weekdays.length - 1]);
  updateFormatted(end);
  if (today) {
    updateRelative(end, today, end.hasTime);
  }
  return end;
}
export function getStartOfMonth(timestamp) {
  const start = copyTimestamp(timestamp);
  start.day = DAY_MIN;
  updateWeekday(start);
  updateFormatted(start);
  return start;
}
export function getEndOfMonth(timestamp) {
  const end = copyTimestamp(timestamp);
  end.day = daysInMonth(end.year, end.month);
  updateWeekday(end);
  updateFormatted(end);
  return end;
}
export function validateTime(input) {
  return typeof input === 'number' && isFinite(input) || !!PARSE_TIME.exec(input) || typeof input === 'object' && isFinite(input.hour) && isFinite(input.minute);
}
export function parseTime(input) {
  if (typeof input === 'number') {
    // when a number is given, it's minutes since 12:00am
    return input;
  } else if (typeof input === 'string') {
    // when a string is given, it's a hh:mm:ss format where seconds are optional
    const parts = PARSE_TIME.exec(input);
    if (!parts) {
      return false;
    }
    return parseInt(parts[1]) * 60 + parseInt(parts[3] || 0);
  } else if (typeof input === 'object') {
    // when an object is given, it must have hour and minute
    if (typeof input.hour !== 'number' || typeof input.minute !== 'number') {
      return false;
    }
    return input.hour * 60 + input.minute;
  } else {
    // unsupported type
    return false;
  }
}
export function validateTimestamp(input) {
  return typeof input === 'number' && isFinite(input) || typeof input === 'string' && !!PARSE_REGEX.exec(input) || input instanceof Date;
}
export function parseTimestamp(input) {
  let required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let now = arguments.length > 2 ? arguments[2] : undefined;
  if (typeof input === 'number' && isFinite(input)) {
    input = new Date(input);
  }
  if (input instanceof Date) {
    const date = parseDate(input);
    if (now) {
      updateRelative(date, now, date.hasTime);
    }
    return date;
  }
  if (typeof input !== 'string') {
    if (required) {
      throw new Error(`${input} is not a valid timestamp. It must be a Date, number of milliseconds since Epoch, or a string in the format of YYYY-MM-DD or YYYY-MM-DD hh:mm. Zero-padding is optional and seconds are ignored.`);
    }
    return null;
  }

  // YYYY-MM-DD hh:mm:ss
  const parts = PARSE_REGEX.exec(input);
  if (!parts) {
    if (required) {
      throw new Error(`${input} is not a valid timestamp. It must be a Date, number of milliseconds since Epoch, or a string in the format of YYYY-MM-DD or YYYY-MM-DD hh:mm. Zero-padding is optional and seconds are ignored.`);
    }
    return null;
  }
  const timestamp = {
    date: input,
    time: '',
    year: parseInt(parts[1]),
    month: parseInt(parts[2]),
    day: parseInt(parts[4]) || 1,
    hour: parseInt(parts[6]) || 0,
    minute: parseInt(parts[8]) || 0,
    weekday: 0,
    hasDay: !!parts[4],
    hasTime: !!(parts[6] && parts[8]),
    past: false,
    present: false,
    future: false
  };
  updateWeekday(timestamp);
  updateFormatted(timestamp);
  if (now) {
    updateRelative(timestamp, now, timestamp.hasTime);
  }
  return timestamp;
}
export function parseDate(date) {
  return updateFormatted({
    date: '',
    time: '',
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    hasDay: true,
    hasTime: true,
    past: false,
    present: true,
    future: false
  });
}
export function getDayIdentifier(timestamp) {
  return timestamp.year * OFFSET_YEAR + timestamp.month * OFFSET_MONTH + timestamp.day;
}
export function getTimeIdentifier(timestamp) {
  return timestamp.hour * OFFSET_HOUR + timestamp.minute;
}
export function getTimestampIdentifier(timestamp) {
  return getDayIdentifier(timestamp) * OFFSET_TIME + getTimeIdentifier(timestamp);
}
export function updateRelative(timestamp, now) {
  let time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let a = getDayIdentifier(now);
  let b = getDayIdentifier(timestamp);
  let present = a === b;
  if (timestamp.hasTime && time && present) {
    a = getTimeIdentifier(now);
    b = getTimeIdentifier(timestamp);
    present = a === b;
  }
  timestamp.past = b < a;
  timestamp.present = present;
  timestamp.future = b > a;
  return timestamp;
}
export function isTimedless(input) {
  return input instanceof Date || typeof input === 'number' && isFinite(input);
}
export function updateHasTime(timestamp, hasTime, now) {
  if (timestamp.hasTime !== hasTime) {
    timestamp.hasTime = hasTime;
    if (!hasTime) {
      timestamp.hour = HOUR_MAX;
      timestamp.minute = MINUTE_MAX;
      timestamp.time = getTime(timestamp);
    }
    if (now) {
      updateRelative(timestamp, now, timestamp.hasTime);
    }
  }
  return timestamp;
}
export function updateMinutes(timestamp, minutes, now) {
  timestamp.hasTime = true;
  timestamp.hour = Math.floor(minutes / MINUTES_IN_HOUR);
  timestamp.minute = minutes % MINUTES_IN_HOUR;
  timestamp.time = getTime(timestamp);
  if (now) {
    updateRelative(timestamp, now, true);
  }
  return timestamp;
}
export function updateWeekday(timestamp) {
  timestamp.weekday = getWeekday(timestamp);
  return timestamp;
}
export function updateFormatted(timestamp) {
  timestamp.time = getTime(timestamp);
  timestamp.date = getDate(timestamp);
  return timestamp;
}
export function getWeekday(timestamp) {
  if (timestamp.hasDay) {
    const _ = Math.floor;
    const k = timestamp.day;
    const m = (timestamp.month + 9) % MONTH_MAX + 1;
    const C = _(timestamp.year / 100);
    const Y = timestamp.year % 100 - (timestamp.month <= 2 ? 1 : 0);
    return ((k + _(2.6 * m - 0.2) - 2 * C + Y + _(Y / 4) + _(C / 4)) % 7 + 7) % 7;
  }
  return timestamp.weekday;
}
export function daysInMonth(year, month) {
  return isLeapYear(year) ? DAYS_IN_MONTH_LEAP[month] : DAYS_IN_MONTH[month];
}
export function copyTimestamp(timestamp) {
  const {
    date,
    time,
    year,
    month,
    day,
    weekday,
    hour,
    minute,
    hasDay,
    hasTime,
    past,
    present,
    future
  } = timestamp;
  return {
    date,
    time,
    year,
    month,
    day,
    weekday,
    hour,
    minute,
    hasDay,
    hasTime,
    past,
    present,
    future
  };
}
export function padNumber(x, length) {
  let padded = String(x);
  while (padded.length < length) {
    padded = '0' + padded;
  }
  return padded;
}
export function getDate(timestamp) {
  let str = `${padNumber(timestamp.year, 4)}-${padNumber(timestamp.month, 2)}`;
  if (timestamp.hasDay) str += `-${padNumber(timestamp.day, 2)}`;
  return str;
}
export function getTime(timestamp) {
  if (!timestamp.hasTime) {
    return '';
  }
  return `${padNumber(timestamp.hour, 2)}:${padNumber(timestamp.minute, 2)}`;
}
export function nextMinutes(timestamp, minutes) {
  timestamp.minute += minutes;
  while (timestamp.minute > MINUTES_IN_HOUR) {
    timestamp.minute -= MINUTES_IN_HOUR;
    timestamp.hour++;
    if (timestamp.hour >= HOURS_IN_DAY) {
      nextDay(timestamp);
      timestamp.hour = FIRST_HOUR;
    }
  }
  return timestamp;
}
export function nextDay(timestamp) {
  timestamp.day++;
  timestamp.weekday = (timestamp.weekday + 1) % DAYS_IN_WEEK;
  if (timestamp.day > DAYS_IN_MONTH_MIN && timestamp.day > daysInMonth(timestamp.year, timestamp.month)) {
    timestamp.day = DAY_MIN;
    timestamp.month++;
    if (timestamp.month > MONTH_MAX) {
      timestamp.month = MONTH_MIN;
      timestamp.year++;
    }
  }
  return timestamp;
}
export function prevDay(timestamp) {
  timestamp.day--;
  timestamp.weekday = (timestamp.weekday + 6) % DAYS_IN_WEEK;
  if (timestamp.day < DAY_MIN) {
    timestamp.month--;
    if (timestamp.month < MONTH_MIN) {
      timestamp.year--;
      timestamp.month = MONTH_MAX;
    }
    timestamp.day = daysInMonth(timestamp.year, timestamp.month);
  }
  return timestamp;
}
export function relativeDays(timestamp) {
  let mover = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : nextDay;
  let days = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  while (--days >= 0) mover(timestamp);
  return timestamp;
}
export function diffMinutes(min, max) {
  const Y = (max.year - min.year) * 525600;
  const M = (max.month - min.month) * 43800;
  const D = (max.day - min.day) * 1440;
  const h = (max.hour - min.hour) * 60;
  const m = max.minute - min.minute;
  return Y + M + D + h + m;
}
export function findWeekday(timestamp, weekday) {
  let mover = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : nextDay;
  let maxDays = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 6;
  while (timestamp.weekday !== weekday && --maxDays >= 0) mover(timestamp);
  return timestamp;
}
export function getWeekdaySkips(weekdays) {
  const skips = [1, 1, 1, 1, 1, 1, 1];
  const filled = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < weekdays.length; i++) {
    filled[weekdays[i]] = 1;
  }
  for (let k = 0; k < DAYS_IN_WEEK; k++) {
    let skip = 1;
    for (let j = 1; j < DAYS_IN_WEEK; j++) {
      const next = (k + j) % DAYS_IN_WEEK;
      if (filled[next]) {
        break;
      }
      skip++;
    }
    skips[k] = filled[k] * skip;
  }
  return skips;
}
export function timestampToDate(timestamp) {
  const time = `${padNumber(timestamp.hour, 2)}:${padNumber(timestamp.minute, 2)}`;
  const date = timestamp.date;
  return new Date(`${date}T${time}:00+00:00`);
}
export function createDayList(start, end, now, weekdaySkips) {
  let max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 42;
  let min = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  const stop = getDayIdentifier(end);
  const days = [];
  let current = copyTimestamp(start);
  let currentIdentifier = 0;
  let stopped = currentIdentifier === stop;
  if (stop < getDayIdentifier(start)) {
    throw new Error('End date is earlier than start date.');
  }
  while ((!stopped || days.length < min) && days.length < max) {
    currentIdentifier = getDayIdentifier(current);
    stopped = stopped || currentIdentifier === stop;
    if (weekdaySkips[current.weekday] === 0) {
      current = nextDay(current);
      continue;
    }
    const day = copyTimestamp(current);
    updateFormatted(day);
    updateRelative(day, now);
    days.push(day);
    current = relativeDays(current, nextDay, weekdaySkips[current.weekday]);
  }
  if (!days.length) throw new Error('No dates found using specified start date, end date, and weekdays.');
  return days;
}
export function createIntervalList(timestamp, first, minutes, count, now) {
  const intervals = [];
  for (let i = 0; i < count; i++) {
    const mins = first + i * minutes;
    const int = copyTimestamp(timestamp);
    intervals.push(updateMinutes(int, mins, now));
  }
  return intervals;
}
export function createNativeLocaleFormatter(locale, getOptions) {
  const emptyFormatter = (_t, _s) => '';
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
    return emptyFormatter;
  }
  return (timestamp, short) => {
    try {
      const intlFormatter = new Intl.DateTimeFormat(locale || undefined, getOptions(timestamp, short));
      return intlFormatter.format(timestampToDate(timestamp));
    } catch (e) {
      return '';
    }
  };
}
//# sourceMappingURL=timestamp.mjs.map