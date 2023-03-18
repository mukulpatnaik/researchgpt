// @ts-nocheck
/* eslint-disable */

// Styles
import "./VSkeletonLoader.css";

// Mixins
import Elevatable from "../../mixins/elevatable.mjs";
import Measurable from "../../mixins/measurable.mjs";
import Themeable from "../../mixins/themeable.mjs"; // Utilities
import mixins from "../../util/mixins.mjs"; // Types
import { getSlot } from "../../util/helpers.mjs";
/* @vue/component */
export default mixins(Elevatable, Measurable, Themeable).extend({
  name: 'VSkeletonLoader',
  props: {
    boilerplate: Boolean,
    loading: Boolean,
    tile: Boolean,
    transition: String,
    type: String,
    types: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    attrs() {
      if (!this.isLoading) return this.$attrs;
      return !this.boilerplate ? {
        'aria-busy': true,
        'aria-live': 'polite',
        role: 'alert',
        ...this.$attrs
      } : {};
    },
    classes() {
      return {
        'v-skeleton-loader--boilerplate': this.boilerplate,
        'v-skeleton-loader--is-loading': this.isLoading,
        'v-skeleton-loader--tile': this.tile,
        ...this.themeClasses,
        ...this.elevationClasses
      };
    },
    isLoading() {
      return !('default' in this.$scopedSlots) || this.loading;
    },
    rootTypes() {
      return {
        actions: 'button@2',
        article: 'heading, paragraph',
        avatar: 'avatar',
        button: 'button',
        card: 'image, card-heading',
        'card-avatar': 'image, list-item-avatar',
        'card-heading': 'heading',
        chip: 'chip',
        'date-picker': 'list-item, card-heading, divider, date-picker-options, date-picker-days, actions',
        'date-picker-options': 'text, avatar@2',
        'date-picker-days': 'avatar@28',
        heading: 'heading',
        image: 'image',
        'list-item': 'text',
        'list-item-avatar': 'avatar, text',
        'list-item-two-line': 'sentences',
        'list-item-avatar-two-line': 'avatar, sentences',
        'list-item-three-line': 'paragraph',
        'list-item-avatar-three-line': 'avatar, paragraph',
        paragraph: 'text@3',
        sentences: 'text@2',
        table: 'table-heading, table-thead, table-tbody, table-tfoot',
        'table-heading': 'heading, text',
        'table-thead': 'heading@6',
        'table-tbody': 'table-row-divider@6',
        'table-row-divider': 'table-row, divider',
        'table-row': 'table-cell@6',
        'table-cell': 'text',
        'table-tfoot': 'text@2, avatar@2',
        text: 'text',
        ...this.types
      };
    }
  },
  methods: {
    genBone(text, children) {
      return this.$createElement('div', {
        staticClass: `v-skeleton-loader__${text} v-skeleton-loader__bone`
      }, children);
    },
    genBones(bone) {
      // e.g. 'text@3'
      const [type, length] = bone.split('@');
      const generator = () => this.genStructure(type);

      // Generate a length array based upon
      // value after @ in the bone string
      return Array.from({
        length
      }).map(generator);
    },
    // Fix type when this is merged
    // https://github.com/microsoft/TypeScript/pull/33050
    genStructure(type) {
      let children = [];
      type = type || this.type || '';
      const bone = this.rootTypes[type] || '';

      // End of recursion, do nothing
      /* eslint-disable-next-line no-empty, brace-style */
      if (type === bone) {}
      // Array of values - e.g. 'heading, paragraph, text@2'
      else if (type.indexOf(',') > -1) return this.mapBones(type);
      // Array of values - e.g. 'paragraph@4'
      else if (type.indexOf('@') > -1) return this.genBones(type);
      // Array of values - e.g. 'card@2'
      else if (bone.indexOf(',') > -1) children = this.mapBones(bone);
      // Array of values - e.g. 'list-item@2'
      else if (bone.indexOf('@') > -1) children = this.genBones(bone);
      // Single value - e.g. 'card-heading'
      else if (bone) children.push(this.genStructure(bone));
      return [this.genBone(type, children)];
    },
    genSkeleton() {
      const children = [];
      if (!this.isLoading) children.push(getSlot(this));else children.push(this.genStructure());

      /* istanbul ignore else */
      if (!this.transition) return children;

      /* istanbul ignore next */
      return this.$createElement('transition', {
        props: {
          name: this.transition
        },
        // Only show transition when
        // content has been loaded
        on: {
          afterEnter: this.resetStyles,
          beforeEnter: this.onBeforeEnter,
          beforeLeave: this.onBeforeLeave,
          leaveCancelled: this.resetStyles
        }
      }, children);
    },
    mapBones(bones) {
      // Remove spaces and return array of structures
      return bones.replace(/\s/g, '').split(',').map(this.genStructure);
    },
    onBeforeEnter(el) {
      this.resetStyles(el);
      if (!this.isLoading) return;
      el._initialStyle = {
        display: el.style.display,
        transition: el.style.transition
      };
      el.style.setProperty('transition', 'none', 'important');
    },
    onBeforeLeave(el) {
      el.style.setProperty('display', 'none', 'important');
    },
    resetStyles(el) {
      if (!el._initialStyle) return;
      el.style.display = el._initialStyle.display || '';
      el.style.transition = el._initialStyle.transition;
      delete el._initialStyle;
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'v-skeleton-loader',
      attrs: this.attrs,
      on: this.$listeners,
      class: this.classes,
      style: this.isLoading ? this.measurableStyles : undefined
    }, [this.genSkeleton()]);
  }
});
//# sourceMappingURL=VSkeletonLoader.mjs.map