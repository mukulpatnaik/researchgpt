// @ts-nocheck
/* eslint-disable */
import { parseTimestamp, getDayIdentifier, getTimestampIdentifier, isTimedless, updateHasTime } from "./timestamp.mjs";
export function parseEvent(input, index, startProperty, endProperty) {
  let timed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let category = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  const startInput = input[startProperty];
  const endInput = input[endProperty];
  const startParsed = parseTimestamp(startInput, true);
  const endParsed = endInput ? parseTimestamp(endInput, true) : startParsed;
  const start = isTimedless(startInput) ? updateHasTime(startParsed, timed) : startParsed;
  const end = isTimedless(endInput) ? updateHasTime(endParsed, timed) : endParsed;
  const startIdentifier = getDayIdentifier(start);
  const startTimestampIdentifier = getTimestampIdentifier(start);
  const endIdentifier = getDayIdentifier(end);
  const endOffset = start.hasTime ? 0 : 2359;
  const endTimestampIdentifier = getTimestampIdentifier(end) + endOffset;
  const allDay = !start.hasTime;
  return {
    input,
    start,
    startIdentifier,
    startTimestampIdentifier,
    end,
    endIdentifier,
    endTimestampIdentifier,
    allDay,
    index,
    category
  };
}
export function isEventOn(event, dayIdentifier) {
  return dayIdentifier >= event.startIdentifier && dayIdentifier <= event.endIdentifier;
}
export function isEventHiddenOn(event, day) {
  return event.end.time === '00:00' && event.end.date === day.date && event.start.date !== day.date;
}
export function isEventStart(event, day, dayIdentifier, firstWeekday) {
  return dayIdentifier === event.startIdentifier || firstWeekday === day.weekday && isEventOn(event, dayIdentifier);
}
export function isEventOverlapping(event, startIdentifier, endIdentifier) {
  return startIdentifier <= event.endIdentifier && endIdentifier >= event.startIdentifier;
}
//# sourceMappingURL=events.mjs.map