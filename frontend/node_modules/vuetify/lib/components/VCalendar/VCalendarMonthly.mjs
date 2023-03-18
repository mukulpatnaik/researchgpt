// @ts-nocheck
/* eslint-disable */

// Styles
import "./VCalendarWeekly.css";

// Mixins
import VCalendarWeekly from "./VCalendarWeekly.mjs"; // Util
import { parseTimestamp, getStartOfMonth, getEndOfMonth } from "./util/timestamp.mjs";
/* @vue/component */
export default VCalendarWeekly.extend({
  name: 'v-calendar-monthly',
  computed: {
    staticClass() {
      return 'v-calendar-monthly v-calendar-weekly';
    },
    parsedStart() {
      return getStartOfMonth(parseTimestamp(this.start, true));
    },
    parsedEnd() {
      return getEndOfMonth(parseTimestamp(this.end, true));
    }
  }
});
//# sourceMappingURL=VCalendarMonthly.mjs.map