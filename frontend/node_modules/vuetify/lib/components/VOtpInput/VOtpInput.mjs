// @ts-nocheck
/* eslint-disable */

// Styles
import "../VTextField/VTextField.css";
import "./VOtpInput.css";

// Extensions
import VInput from "../VInput/index.mjs";
import VTextField from "../VTextField/VTextField.mjs"; // Directives
import ripple from "../../directives/ripple/index.mjs"; // Utilities
import { convertToUnit, keyCodes } from "../../util/helpers.mjs";
import { breaking } from "../../util/console.mjs"; // Types
import mixins from "../../util/mixins.mjs";
const baseMixins = mixins(VInput);
/* @vue/component */
export default baseMixins.extend().extend({
  name: 'v-otp-input',
  directives: {
    ripple
  },
  inheritAttrs: false,
  props: {
    length: {
      type: [Number, String],
      default: 6
    },
    type: {
      type: String,
      default: 'text'
    },
    plain: Boolean
  },
  data: () => ({
    initialValue: null,
    isBooted: false,
    otp: []
  }),
  computed: {
    outlined() {
      return !this.plain;
    },
    classes() {
      return {
        ...VInput.options.computed.classes.call(this),
        ...VTextField.options.computed.classes.call(this),
        'v-otp-input--plain': this.plain
      };
    }
  },
  watch: {
    isFocused: 'updateValue',
    value(val) {
      this.lazyValue = val;
      this.otp = val?.split('') || [];
    }
  },
  created() {
    /* istanbul ignore next */
    if (this.$attrs.hasOwnProperty('browser-autocomplete')) {
      breaking('browser-autocomplete', 'autocomplete', this);
    }
    this.otp = this.internalValue?.split('') || [];
  },
  mounted() {
    requestAnimationFrame(() => this.isBooted = true);
  },
  methods: {
    /** @public */
    focus(e, otpIdx) {
      this.onFocus(e, otpIdx || 0);
    },
    genInputSlot(otpIdx) {
      return this.$createElement('div', this.setBackgroundColor(this.backgroundColor, {
        staticClass: 'v-input__slot',
        style: {
          height: convertToUnit(this.height)
        },
        on: {
          click: () => this.onClick(otpIdx),
          mousedown: e => this.onMouseDown(e, otpIdx),
          mouseup: e => this.onMouseUp(e, otpIdx)
        }
      }), [this.genDefaultSlot(otpIdx)]);
    },
    genControl(otpIdx) {
      return this.$createElement('div', {
        staticClass: 'v-input__control'
      }, [this.genInputSlot(otpIdx)]);
    },
    genDefaultSlot(otpIdx) {
      return [this.genFieldset(), this.genTextFieldSlot(otpIdx)];
    },
    genContent() {
      return Array.from({
        length: +this.length
      }, (_, i) => {
        return this.$createElement('div', this.setTextColor(this.validationState, {
          staticClass: 'v-input',
          class: this.classes
        }), [this.genControl(i)]);
      });
    },
    genFieldset() {
      return this.$createElement('fieldset', {
        attrs: {
          'aria-hidden': true
        }
      }, [this.genLegend()]);
    },
    genLegend() {
      const span = this.$createElement('span', {
        domProps: {
          innerHTML: '&#8203;'
        }
      });
      return this.$createElement('legend', {
        style: {
          width: '0px'
        }
      }, [span]);
    },
    genInput(otpIdx) {
      const listeners = Object.assign({}, this.listeners$);
      delete listeners.change; // Change should not be bound externally

      return this.$createElement('input', {
        style: {},
        domProps: {
          value: this.otp[otpIdx],
          min: this.type === 'number' ? 0 : null
        },
        attrs: {
          ...this.attrs$,
          autocomplete: 'one-time-code',
          disabled: this.isDisabled,
          readonly: this.isReadonly,
          type: this.type,
          id: `${this.computedId}--${otpIdx}`,
          class: `otp-field-box--${otpIdx}`
        },
        on: Object.assign(listeners, {
          blur: this.onBlur,
          input: e => this.onInput(e, otpIdx),
          focus: e => this.onFocus(e, otpIdx),
          keydown: this.onKeyDown,
          keyup: e => this.onKeyUp(e, otpIdx)
        }),
        ref: 'input',
        refInFor: true
      });
    },
    genTextFieldSlot(otpIdx) {
      return this.$createElement('div', {
        staticClass: 'v-text-field__slot'
      }, [this.genInput(otpIdx)]);
    },
    onBlur(e) {
      this.isFocused = false;
      e && this.$nextTick(() => this.$emit('blur', e));
    },
    onClick(otpIdx) {
      if (this.isFocused || this.isDisabled || !this.$refs.input[otpIdx]) return;
      this.onFocus(undefined, otpIdx);
    },
    onFocus(e, otpIdx) {
      e?.preventDefault();
      e?.stopPropagation();
      const elements = this.$refs.input;
      const ref = this.$refs.input && elements[otpIdx || 0];
      if (!ref) return;
      if (document.activeElement !== ref) {
        ref.focus();
        return ref.select();
      }
      if (!this.isFocused) {
        this.isFocused = true;
        ref.select();
        e && this.$emit('focus', e);
      }
    },
    onInput(e, index) {
      const maxCursor = +this.length - 1;
      const target = e.target;
      const value = target.value;
      const inputDataArray = value?.split('') || [];
      const newOtp = [...this.otp];
      for (let i = 0; i < inputDataArray.length; i++) {
        const appIdx = index + i;
        if (appIdx > maxCursor) break;
        newOtp[appIdx] = inputDataArray[i].toString();
      }
      if (!inputDataArray.length) {
        newOtp.splice(index, 1);
      }
      this.otp = newOtp;
      this.internalValue = this.otp.join('');
      if (index + inputDataArray.length >= +this.length) {
        this.onCompleted();
        this.clearFocus(index);
      } else if (inputDataArray.length) {
        this.changeFocus(index + inputDataArray.length);
      }
    },
    clearFocus(index) {
      const input = this.$refs.input[index];
      input.blur();
    },
    onKeyDown(e) {
      if (e.keyCode === keyCodes.enter) {
        this.$emit('change', this.internalValue);
      }
      this.$emit('keydown', e);
    },
    onMouseDown(e, otpIdx) {
      // Prevent input from being blurred
      if (e.target !== this.$refs.input[otpIdx]) {
        e.preventDefault();
        e.stopPropagation();
      }
      VInput.options.methods.onMouseDown.call(this, e);
    },
    onMouseUp(e, otpIdx) {
      if (this.hasMouseDown) this.focus(e, otpIdx);
      VInput.options.methods.onMouseUp.call(this, e);
    },
    changeFocus(index) {
      this.onFocus(undefined, index || 0);
    },
    updateValue(val) {
      // Sets validationState from validatable
      this.hasColor = val;
      if (val) {
        this.initialValue = this.lazyValue;
      } else if (this.initialValue !== this.lazyValue) {
        this.$emit('change', this.lazyValue);
      }
    },
    onKeyUp(event, index) {
      event.preventDefault();
      const eventKey = event.key;
      if (['Tab', 'Shift', 'Meta', 'Control', 'Alt'].includes(eventKey)) {
        return;
      }
      if (['Delete'].includes(eventKey)) {
        return;
      }
      if (eventKey === 'ArrowLeft' || eventKey === 'Backspace' && !this.otp[index]) {
        return index > 0 && this.changeFocus(index - 1);
      }
      if (eventKey === 'ArrowRight') {
        return index + 1 < +this.length && this.changeFocus(index + 1);
      }
    },
    onCompleted() {
      const rsp = this.otp.join('');
      if (rsp.length === +this.length) {
        this.$emit('finish', rsp);
      }
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'v-otp-input',
      class: this.themeClasses
    }, this.genContent());
  }
});
//# sourceMappingURL=VOtpInput.mjs.map