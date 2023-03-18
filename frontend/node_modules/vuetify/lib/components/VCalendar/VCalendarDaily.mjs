// @ts-nocheck
/* eslint-disable */

// Styles
import "./VCalendarDaily.css";

// Types
// Directives
import Resize from "../../directives/resize/index.mjs"; // Components
import VBtn from "../VBtn/index.mjs"; // Mixins
import CalendarWithIntervals from "./mixins/calendar-with-intervals.mjs"; // Util
import { convertToUnit, getSlot } from "../../util/helpers.mjs";
/* @vue/component */
export default CalendarWithIntervals.extend({
  name: 'v-calendar-daily',
  directives: {
    Resize
  },
  data: () => ({
    scrollPush: 0
  }),
  computed: {
    classes() {
      return {
        'v-calendar-daily': true,
        ...this.themeClasses
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$nextTick(this.onResize);
    },
    onResize() {
      this.scrollPush = this.getScrollPush();
    },
    getScrollPush() {
      const area = this.$refs.scrollArea;
      const pane = this.$refs.pane;
      return area && pane ? area.offsetWidth - pane.offsetWidth : 0;
    },
    genHead() {
      return this.$createElement('div', {
        staticClass: 'v-calendar-daily__head',
        style: {
          marginRight: this.scrollPush + 'px'
        }
      }, [this.genHeadIntervals(), ...this.genHeadDays()]);
    },
    genHeadIntervals() {
      const width = convertToUnit(this.intervalWidth);
      return this.$createElement('div', {
        staticClass: 'v-calendar-daily__intervals-head',
        style: {
          width
        }
      }, getSlot(this, 'interval-header'));
    },
    genHeadDays() {
      return this.days.map(this.genHeadDay);
    },
    genHeadDay(day, index) {
      return this.$createElement('div', {
        key: day.date,
        staticClass: 'v-calendar-daily_head-day',
        class: this.getRelativeClasses(day),
        on: this.getDefaultMouseEventHandlers(':day', nativeEvent => {
          return {
            nativeEvent,
            ...this.getSlotScope(day)
          };
        })
      }, [this.genHeadWeekday(day), this.genHeadDayLabel(day), ...this.genDayHeader(day, index)]);
    },
    genDayHeader(day, index) {
      return getSlot(this, 'day-header', () => ({
        week: this.days,
        ...day,
        index
      })) || [];
    },
    genHeadWeekday(day) {
      const color = day.present ? this.color : undefined;
      return this.$createElement('div', this.setTextColor(color, {
        staticClass: 'v-calendar-daily_head-weekday'
      }), this.weekdayFormatter(day, this.shortWeekdays));
    },
    genHeadDayLabel(day) {
      return this.$createElement('div', {
        staticClass: 'v-calendar-daily_head-day-label'
      }, getSlot(this, 'day-label-header', day) || [this.genHeadDayButton(day)]);
    },
    genHeadDayButton(day) {
      const color = day.present ? this.color : 'transparent';
      return this.$createElement(VBtn, {
        props: {
          color,
          fab: true,
          depressed: true
        },
        on: this.getMouseEventHandlers({
          'click:date': {
            event: 'click',
            stop: true
          },
          'contextmenu:date': {
            event: 'contextmenu',
            stop: true,
            prevent: true,
            result: false
          }
        }, nativeEvent => {
          return {
            nativeEvent,
            ...day
          };
        })
      }, this.dayFormatter(day, false));
    },
    genBody() {
      return this.$createElement('div', {
        staticClass: 'v-calendar-daily__body'
      }, [this.genScrollArea()]);
    },
    genScrollArea() {
      return this.$createElement('div', {
        ref: 'scrollArea',
        staticClass: 'v-calendar-daily__scroll-area'
      }, [this.genPane()]);
    },
    genPane() {
      return this.$createElement('div', {
        ref: 'pane',
        staticClass: 'v-calendar-daily__pane',
        style: {
          height: convertToUnit(this.bodyHeight)
        }
      }, [this.genDayContainer()]);
    },
    genDayContainer() {
      return this.$createElement('div', {
        staticClass: 'v-calendar-daily__day-container'
      }, [this.genBodyIntervals(), ...this.genDays()]);
    },
    genDays() {
      return this.days.map(this.genDay);
    },
    genDay(day, index) {
      return this.$createElement('div', {
        key: day.date,
        staticClass: 'v-calendar-daily__day',
        class: this.getRelativeClasses(day),
        on: this.getDefaultMouseEventHandlers(':time', nativeEvent => {
          return {
            nativeEvent,
            ...this.getSlotScope(this.getTimestampAtEvent(nativeEvent, day))
          };
        })
      }, [...this.genDayIntervals(index), ...this.genDayBody(day)]);
    },
    genDayBody(day) {
      return getSlot(this, 'day-body', () => this.getSlotScope(day)) || [];
    },
    genDayIntervals(index) {
      return this.intervals[index].map(this.genDayInterval);
    },
    genDayInterval(interval) {
      const height = convertToUnit(this.intervalHeight);
      const styler = this.intervalStyle || this.intervalStyleDefault;
      const data = {
        key: interval.time,
        staticClass: 'v-calendar-daily__day-interval',
        style: {
          height,
          ...styler(interval)
        }
      };
      const children = getSlot(this, 'interval', () => this.getSlotScope(interval));
      return this.$createElement('div', data, children);
    },
    genBodyIntervals() {
      const width = convertToUnit(this.intervalWidth);
      const data = {
        staticClass: 'v-calendar-daily__intervals-body',
        style: {
          width
        },
        on: this.getDefaultMouseEventHandlers(':interval', nativeEvent => {
          return {
            nativeEvent,
            ...this.getTimestampAtEvent(nativeEvent, this.parsedStart)
          };
        })
      };
      return this.$createElement('div', data, this.genIntervalLabels());
    },
    genIntervalLabels() {
      if (!this.intervals.length) return null;
      return this.intervals[0].map(this.genIntervalLabel);
    },
    genIntervalLabel(interval) {
      const height = convertToUnit(this.intervalHeight);
      const short = this.shortIntervals;
      const shower = this.showIntervalLabel || this.showIntervalLabelDefault;
      const show = shower(interval);
      const label = show ? this.intervalFormatter(interval, short) : undefined;
      return this.$createElement('div', {
        key: interval.time,
        staticClass: 'v-calendar-daily__interval',
        style: {
          height
        }
      }, [this.$createElement('div', {
        staticClass: 'v-calendar-daily__interval-text'
      }, label)]);
    }
  },
  render(h) {
    return h('div', {
      class: this.classes,
      on: {
        dragstart: e => {
          e.preventDefault();
        }
      },
      directives: [{
        modifiers: {
          quiet: true
        },
        name: 'resize',
        value: this.onResize
      }]
    }, [!this.hideHeader ? this.genHead() : '', this.genBody()]);
  }
});
//# sourceMappingURL=VCalendarDaily.mjs.map