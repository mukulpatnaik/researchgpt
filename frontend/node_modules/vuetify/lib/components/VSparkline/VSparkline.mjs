// @ts-nocheck
/* eslint-disable */
// Mixins
import Colorable from "../../mixins/colorable.mjs"; // Utilities
import mixins from "../../util/mixins.mjs";
import { genPoints, genBars } from "./helpers/core.mjs";
import { genPath } from "./helpers/path.mjs"; // Types
export default mixins(Colorable).extend({
  name: 'VSparkline',
  inheritAttrs: false,
  props: {
    autoDraw: Boolean,
    autoDrawDuration: {
      type: Number,
      default: 2000
    },
    autoDrawEasing: {
      type: String,
      default: 'ease'
    },
    autoLineWidth: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary'
    },
    fill: {
      type: Boolean,
      default: false
    },
    gradient: {
      type: Array,
      default: () => []
    },
    gradientDirection: {
      type: String,
      validator: val => ['top', 'bottom', 'left', 'right'].includes(val),
      default: 'top'
    },
    height: {
      type: [String, Number],
      default: 75
    },
    labels: {
      type: Array,
      default: () => []
    },
    labelSize: {
      type: [Number, String],
      default: 7
    },
    lineWidth: {
      type: [String, Number],
      default: 4
    },
    padding: {
      type: [String, Number],
      default: 8
    },
    showLabels: Boolean,
    smooth: {
      type: [Boolean, Number, String],
      default: false
    },
    type: {
      type: String,
      default: 'trend',
      validator: val => ['trend', 'bar'].includes(val)
    },
    value: {
      type: Array,
      default: () => []
    },
    width: {
      type: [Number, String],
      default: 300
    }
  },
  data: () => ({
    lastLength: 0
  }),
  computed: {
    parsedPadding() {
      return Number(this.padding);
    },
    parsedWidth() {
      return Number(this.width);
    },
    parsedHeight() {
      return parseInt(this.height, 10);
    },
    parsedLabelSize() {
      return parseInt(this.labelSize, 10) || 7;
    },
    totalHeight() {
      let height = this.parsedHeight;
      if (this.hasLabels) height += parseInt(this.labelSize, 10) * 1.5;
      return height;
    },
    totalWidth() {
      let width = this.parsedWidth;
      if (this.type === 'bar') width = Math.max(this.value.length * this._lineWidth, width);
      return width;
    },
    totalValues() {
      return this.value.length;
    },
    _lineWidth() {
      if (this.autoLineWidth && this.type !== 'trend') {
        const totalPadding = this.parsedPadding * (this.totalValues + 1);
        return (this.parsedWidth - totalPadding) / this.totalValues;
      } else {
        return parseFloat(this.lineWidth) || 4;
      }
    },
    boundary() {
      if (this.type === 'bar') return {
        minX: 0,
        maxX: this.totalWidth,
        minY: 0,
        maxY: this.parsedHeight
      };
      const padding = this.parsedPadding;
      return {
        minX: padding,
        maxX: this.totalWidth - padding,
        minY: padding,
        maxY: this.parsedHeight - padding
      };
    },
    hasLabels() {
      return Boolean(this.showLabels || this.labels.length > 0 || this.$scopedSlots.label);
    },
    parsedLabels() {
      const labels = [];
      const points = this._values;
      const len = points.length;
      for (let i = 0; labels.length < len; i++) {
        const item = points[i];
        let value = this.labels[i];
        if (!value) {
          value = typeof item === 'object' ? item.value : item;
        }
        labels.push({
          x: item.x,
          value: String(value)
        });
      }
      return labels;
    },
    normalizedValues() {
      return this.value.map(item => typeof item === 'number' ? item : item.value);
    },
    _values() {
      return this.type === 'trend' ? genPoints(this.normalizedValues, this.boundary) : genBars(this.normalizedValues, this.boundary);
    },
    textY() {
      let y = this.parsedHeight;
      if (this.type === 'trend') y -= 4;
      return y;
    },
    _radius() {
      return this.smooth === true ? 8 : Number(this.smooth);
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          if (!this.autoDraw || this.type === 'bar' || !this.$refs.path) return;
          const path = this.$refs.path;
          const length = path.getTotalLength();
          if (!this.fill) {
            path.style.transition = 'none';
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = Math.abs(length - (this.lastLength || 0)).toString();
            path.getBoundingClientRect();
            path.style.transition = `stroke-dashoffset ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
            path.style.strokeDashoffset = '0';
          } else {
            path.style.transformOrigin = 'bottom center';
            path.style.transition = 'none';
            path.style.transform = `scaleY(0)`;
            path.getBoundingClientRect();
            path.style.transition = `transform ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
            path.style.transform = `scaleY(1)`;
          }
          this.lastLength = length;
        });
      }
    }
  },
  methods: {
    genGradient() {
      const gradientDirection = this.gradientDirection;
      const gradient = this.gradient.slice();

      // Pushes empty string to force
      // a fallback to currentColor
      if (!gradient.length) gradient.push('');
      const len = Math.max(gradient.length - 1, 1);
      const stops = gradient.reverse().map((color, index) => this.$createElement('stop', {
        attrs: {
          offset: index / len,
          'stop-color': color || 'currentColor'
        }
      }));
      return this.$createElement('defs', [this.$createElement('linearGradient', {
        attrs: {
          id: this._uid,
          gradientUnits: 'userSpaceOnUse',
          x1: gradientDirection === 'left' ? '100%' : '0',
          y1: gradientDirection === 'top' ? '100%' : '0',
          x2: gradientDirection === 'right' ? '100%' : '0',
          y2: gradientDirection === 'bottom' ? '100%' : '0'
        }
      }, stops)]);
    },
    genG(children) {
      return this.$createElement('g', {
        style: {
          fontSize: '8',
          textAnchor: 'middle',
          dominantBaseline: 'mathematical',
          fill: 'currentColor'
        } // TODO: TS 3.5 is too eager with the array type here
      }, children);
    },
    genPath() {
      const points = genPoints(this.normalizedValues, this.boundary);
      return this.$createElement('path', {
        attrs: {
          d: genPath(points, this._radius, this.fill, this.parsedHeight),
          fill: this.fill ? `url(#${this._uid})` : 'none',
          stroke: this.fill ? 'none' : `url(#${this._uid})`
        },
        ref: 'path'
      });
    },
    genLabels(offsetX) {
      const children = this.parsedLabels.map((item, i) => this.$createElement('text', {
        attrs: {
          x: item.x + offsetX + this._lineWidth / 2,
          y: this.textY + this.parsedLabelSize * 0.75,
          'font-size': Number(this.labelSize) || 7
        }
      }, [this.genLabel(item, i)]));
      return this.genG(children);
    },
    genLabel(item, index) {
      return this.$scopedSlots.label ? this.$scopedSlots.label({
        index,
        value: item.value
      }) : item.value;
    },
    genBars() {
      if (!this.value || this.totalValues < 2) return undefined;
      const bars = genBars(this.normalizedValues, this.boundary);
      const offsetX = (Math.abs(bars[0].x - bars[1].x) - this._lineWidth) / 2;
      return this.$createElement('svg', {
        attrs: {
          display: 'block',
          viewBox: `0 0 ${this.totalWidth} ${this.totalHeight}`
        }
      }, [this.genGradient(), this.genClipPath(bars, offsetX, this._lineWidth, 'sparkline-bar-' + this._uid), this.hasLabels ? this.genLabels(offsetX) : undefined, this.$createElement('g', {
        attrs: {
          'clip-path': `url(#sparkline-bar-${this._uid}-clip)`,
          fill: `url(#${this._uid})`
        }
      }, [this.$createElement('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: this.totalWidth,
          height: this.height
        }
      })])]);
    },
    genClipPath(bars, offsetX, lineWidth, id) {
      const rounding = typeof this.smooth === 'number' ? this.smooth : this.smooth ? 2 : 0;
      return this.$createElement('clipPath', {
        attrs: {
          id: `${id}-clip`
        }
      }, bars.map(item => {
        return this.$createElement('rect', {
          attrs: {
            x: item.x + offsetX,
            y: item.y,
            width: lineWidth,
            height: item.height,
            rx: rounding,
            ry: rounding
          }
        }, [this.autoDraw ? this.$createElement('animate', {
          attrs: {
            attributeName: 'height',
            from: 0,
            to: item.height,
            dur: `${this.autoDrawDuration}ms`,
            fill: 'freeze'
          }
        }) : undefined]);
      }));
    },
    genTrend() {
      return this.$createElement('svg', this.setTextColor(this.color, {
        attrs: {
          ...this.$attrs,
          display: 'block',
          'stroke-width': this._lineWidth || 1,
          viewBox: `0 0 ${this.width} ${this.totalHeight}`
        }
      }), [this.genGradient(), this.hasLabels && this.genLabels(-(this._lineWidth / 2)), this.genPath()]);
    }
  },
  render(h) {
    if (this.totalValues < 2) return undefined;
    return this.type === 'trend' ? this.genTrend() : this.genBars();
  }
});
//# sourceMappingURL=VSparkline.mjs.map