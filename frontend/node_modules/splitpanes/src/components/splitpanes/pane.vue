<template>
<div class="splitpanes__pane" @click="onPaneClick($event, _.uid)" :style="style">
  <slot/>
</div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'pane',
  inject: ['requestUpdate', 'onPaneAdd', 'onPaneRemove', 'onPaneClick'],

  props: {
    size: { type: [Number, String], default: null },
    minSize: { type: [Number, String], default: 0 },
    maxSize: { type: [Number, String], default: 100 }
  },

  data: () => ({
    style: {}
  }),

  mounted () {
    this.onPaneAdd(this)
  },

  beforeUnmount () {
    this.onPaneRemove(this)
  },

  methods: {
    // Called from the splitpanes component.
    update (style) {
      this.style = style
    }
  },

  computed: {
    sizeNumber () {
      return (this.size || this.size === 0) ? parseFloat(this.size) : null
    },
    minSizeNumber () {
      return parseFloat(this.minSize)
    },
    maxSizeNumber () {
      return parseFloat(this.maxSize)
    }
  },

  watch: {
    sizeNumber (size) {
      this.requestUpdate({ target: this, size })
    },
    minSizeNumber (min) {
      this.requestUpdate({ target: this, min })
    },
    maxSizeNumber (max) {
      this.requestUpdate({ target: this, max })
    }
  }
}
</script>
