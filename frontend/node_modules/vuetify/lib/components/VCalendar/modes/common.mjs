// @ts-nocheck
/* eslint-disable */
import { getTimestampIdentifier } from "../util/timestamp.mjs";
const MILLIS_IN_DAY = 86400000;
export function getVisuals(events) {
  let minStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const visuals = events.map(event => ({
    event,
    columnCount: 0,
    column: 0,
    left: 0,
    width: 100
  }));
  visuals.sort((a, b) => {
    return Math.max(minStart, a.event.startTimestampIdentifier) - Math.max(minStart, b.event.startTimestampIdentifier) || b.event.endTimestampIdentifier - a.event.endTimestampIdentifier;
  });
  return visuals;
}
export function hasOverlap(s0, e0, s1, e1) {
  let exclude = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  return exclude ? !(s0 >= e1 || e0 <= s1) : !(s0 > e1 || e0 < s1);
}
export function setColumnCount(groups) {
  groups.forEach(group => {
    group.visuals.forEach(groupVisual => {
      groupVisual.columnCount = groups.length;
    });
  });
}
export function getRange(event) {
  return [event.startTimestampIdentifier, event.endTimestampIdentifier];
}
export function getDayRange(event) {
  return [event.startIdentifier, event.endIdentifier];
}
export function getNormalizedRange(event, dayStart) {
  return [Math.max(dayStart, event.startTimestampIdentifier), Math.min(dayStart + MILLIS_IN_DAY, event.endTimestampIdentifier)];
}
export function getOpenGroup(groups, start, end, timed) {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    let intersected = false;
    if (hasOverlap(start, end, group.start, group.end, timed)) {
      for (let k = 0; k < group.visuals.length; k++) {
        const groupVisual = group.visuals[k];
        const [groupStart, groupEnd] = timed ? getRange(groupVisual.event) : getDayRange(groupVisual.event);
        if (hasOverlap(start, end, groupStart, groupEnd, timed)) {
          intersected = true;
          break;
        }
      }
    }
    if (!intersected) {
      return i;
    }
  }
  return -1;
}
export function getOverlapGroupHandler(firstWeekday) {
  const handler = {
    groups: [],
    min: -1,
    max: -1,
    reset: () => {
      handler.groups = [];
      handler.min = handler.max = -1;
    },
    getVisuals: function (day, dayEvents, timed) {
      let reset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      if (day.weekday === firstWeekday || reset) {
        handler.reset();
      }
      const dayStart = getTimestampIdentifier(day);
      const visuals = getVisuals(dayEvents, dayStart);
      visuals.forEach(visual => {
        const [start, end] = timed ? getRange(visual.event) : getDayRange(visual.event);
        if (handler.groups.length > 0 && !hasOverlap(start, end, handler.min, handler.max, timed)) {
          setColumnCount(handler.groups);
          handler.reset();
        }
        let targetGroup = getOpenGroup(handler.groups, start, end, timed);
        if (targetGroup === -1) {
          targetGroup = handler.groups.length;
          handler.groups.push({
            start,
            end,
            visuals: []
          });
        }
        const target = handler.groups[targetGroup];
        target.visuals.push(visual);
        target.start = Math.min(target.start, start);
        target.end = Math.max(target.end, end);
        visual.column = targetGroup;
        if (handler.min === -1) {
          handler.min = start;
          handler.max = end;
        } else {
          handler.min = Math.min(handler.min, start);
          handler.max = Math.max(handler.max, end);
        }
      });
      setColumnCount(handler.groups);
      if (timed) {
        handler.reset();
      }
      return visuals;
    }
  };
  return handler;
}
//# sourceMappingURL=common.mjs.map