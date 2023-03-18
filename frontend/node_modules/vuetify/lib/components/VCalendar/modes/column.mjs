// @ts-nocheck
/* eslint-disable */
import { getOverlapGroupHandler } from "./common.mjs";
const FULL_WIDTH = 100;
export const column = (events, firstWeekday, overlapThreshold) => {
  const handler = getOverlapGroupHandler(firstWeekday);
  return (day, dayEvents, timed, reset) => {
    const visuals = handler.getVisuals(day, dayEvents, timed, reset);
    if (timed) {
      visuals.forEach(visual => {
        visual.left = visual.column * FULL_WIDTH / visual.columnCount;
        visual.width = FULL_WIDTH / visual.columnCount;
      });
    }
    return visuals;
  };
};
//# sourceMappingURL=column.mjs.map