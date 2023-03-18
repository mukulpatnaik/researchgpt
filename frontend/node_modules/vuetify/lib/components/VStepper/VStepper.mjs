// @ts-nocheck
/* eslint-disable */

// Styles
import "./VStepper.css";

// Extensions
import VSheet from "../VSheet/index.mjs"; // Components
// Mixins
import { provide as RegistrableProvide } from "../../mixins/registrable.mjs";
import Proxyable from "../../mixins/proxyable.mjs"; // Utilities
import mixins from "../../util/mixins.mjs";
import { breaking } from "../../util/console.mjs"; // Types
const baseMixins = mixins(VSheet, RegistrableProvide('stepper'), Proxyable);
/* @vue/component */
export default baseMixins.extend({
  name: 'v-stepper',
  provide() {
    return {
      stepClick: this.stepClick,
      isVertical: this.vertical
    };
  },
  props: {
    altLabels: Boolean,
    nonLinear: Boolean,
    flat: Boolean,
    vertical: Boolean
  },
  data() {
    const data = {
      isBooted: false,
      steps: [],
      content: [],
      isReverse: false
    };
    data.internalLazyValue = this.value != null ? this.value : (data[0] || {}).step || 1;
    return data;
  },
  computed: {
    classes() {
      return {
        'v-stepper--flat': this.flat,
        'v-stepper--is-booted': this.isBooted,
        'v-stepper--vertical': this.vertical,
        'v-stepper--alt-labels': this.altLabels,
        'v-stepper--non-linear': this.nonLinear,
        ...VSheet.options.computed.classes.call(this)
      };
    },
    styles() {
      return {
        ...VSheet.options.computed.styles.call(this)
      };
    }
  },
  watch: {
    internalValue(val, oldVal) {
      this.isReverse = Number(val) < Number(oldVal);
      oldVal && (this.isBooted = true);
      this.updateView();
    }
  },
  created() {
    /* istanbul ignore next */
    if (this.$listeners.input) {
      breaking('@input', '@change', this);
    }
  },
  mounted() {
    this.updateView();
  },
  methods: {
    register(item) {
      if (item.$options.name === 'v-stepper-step') {
        this.steps.push(item);
      } else if (item.$options.name === 'v-stepper-content') {
        item.isVertical = this.vertical;
        this.content.push(item);
      }
    },
    unregister(item) {
      if (item.$options.name === 'v-stepper-step') {
        this.steps = this.steps.filter(i => i !== item);
      } else if (item.$options.name === 'v-stepper-content') {
        item.isVertical = this.vertical;
        this.content = this.content.filter(i => i !== item);
      }
    },
    stepClick(step) {
      this.$nextTick(() => this.internalValue = step);
    },
    updateView() {
      for (let index = this.steps.length; --index >= 0;) {
        this.steps[index].toggle(this.internalValue);
      }
      for (let index = this.content.length; --index >= 0;) {
        this.content[index].toggle(this.internalValue, this.isReverse);
      }
    }
  },
  render(h) {
    return h(this.tag, {
      staticClass: 'v-stepper',
      class: this.classes,
      style: this.styles
    }, this.$slots.default);
  }
});
//# sourceMappingURL=VStepper.mjs.map