// @ts-nocheck
/* eslint-disable */

// Styles
import "./VTreeview.css";

// Types
// Components
import VTreeviewNode, { VTreeviewNodeProps } from "./VTreeviewNode.mjs"; // Mixins
import Themeable from "../../mixins/themeable.mjs";
import { provide as RegistrableProvide } from "../../mixins/registrable.mjs"; // Utils
import { arrayDiff, deepEqual, getObjectValueByPath } from "../../util/helpers.mjs";
import mixins from "../../util/mixins.mjs";
import { consoleWarn } from "../../util/console.mjs";
import { filterTreeItems, filterTreeItem } from "./util/filterTreeItems.mjs";
export default mixins(RegistrableProvide('treeview'), Themeable
/* @vue/component */).extend({
  name: 'v-treeview',
  provide() {
    return {
      treeview: this
    };
  },
  props: {
    active: {
      type: Array,
      default: () => []
    },
    dense: Boolean,
    disabled: Boolean,
    filter: Function,
    hoverable: Boolean,
    items: {
      type: Array,
      default: () => []
    },
    multipleActive: Boolean,
    open: {
      type: Array,
      default: () => []
    },
    openAll: Boolean,
    returnObject: {
      type: Boolean,
      default: false // TODO: Should be true in next major
    },

    search: String,
    value: {
      type: Array,
      default: () => []
    },
    ...VTreeviewNodeProps
  },
  data: () => ({
    level: -1,
    activeCache: new Set(),
    nodes: {},
    openCache: new Set(),
    selectedCache: new Set()
  }),
  computed: {
    excludedItems() {
      const excluded = new Set();
      if (!this.search) return excluded;
      for (let i = 0; i < this.items.length; i++) {
        filterTreeItems(this.filter || filterTreeItem, this.items[i], this.search, this.itemKey, this.itemText, this.itemChildren, excluded);
      }
      return excluded;
    }
  },
  watch: {
    items: {
      handler() {
        const oldKeys = Object.keys(this.nodes).map(k => getObjectValueByPath(this.nodes[k].item, this.itemKey));
        const newKeys = this.getKeys(this.items);
        const diff = arrayDiff(newKeys, oldKeys);

        // We only want to do stuff if items have changed
        if (!diff.length && newKeys.length < oldKeys.length) return;

        // If nodes are removed we need to clear them from this.nodes
        diff.forEach(k => delete this.nodes[k]);
        const oldSelectedCache = [...this.selectedCache];
        this.selectedCache = new Set();
        this.activeCache = new Set();
        this.openCache = new Set();
        this.buildTree(this.items);

        // Only emit selected if selection has changed
        // as a result of items changing. This fixes a
        // potential double emit when selecting a node
        // with dynamic children
        if (!deepEqual(oldSelectedCache, [...this.selectedCache])) this.emitSelected();
      },
      deep: true
    },
    active(value) {
      this.handleNodeCacheWatcher(value, this.activeCache, this.updateActive, this.emitActive);
    },
    value(value) {
      this.handleNodeCacheWatcher(value, this.selectedCache, this.updateSelected, this.emitSelected);
    },
    open(value) {
      this.handleNodeCacheWatcher(value, this.openCache, this.updateOpen, this.emitOpen);
    }
  },
  created() {
    const getValue = key => this.returnObject ? getObjectValueByPath(key, this.itemKey) : key;
    this.buildTree(this.items);
    for (const value of this.value.map(getValue)) {
      this.updateSelected(value, true, true);
    }
    for (const active of this.active.map(getValue)) {
      this.updateActive(active, true);
    }
  },
  mounted() {
    // Save the developer from themselves
    if (this.$slots.prepend || this.$slots.append) {
      consoleWarn('The prepend and append slots require a slot-scope attribute', this);
    }
    if (this.openAll) {
      this.updateAll(true);
    } else {
      this.open.forEach(key => this.updateOpen(this.returnObject ? getObjectValueByPath(key, this.itemKey) : key, true));
      this.emitOpen();
    }
  },
  methods: {
    /** @public */
    updateAll(value) {
      Object.keys(this.nodes).forEach(key => this.updateOpen(getObjectValueByPath(this.nodes[key].item, this.itemKey), value));
      this.emitOpen();
    },
    getKeys(items) {
      let keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      for (let i = 0; i < items.length; i++) {
        const key = getObjectValueByPath(items[i], this.itemKey);
        keys.push(key);
        const children = getObjectValueByPath(items[i], this.itemChildren);
        if (children) {
          keys.push(...this.getKeys(children));
        }
      }
      return keys;
    },
    buildTree(items) {
      let parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const key = getObjectValueByPath(item, this.itemKey);
        const children = getObjectValueByPath(item, this.itemChildren) ?? [];
        const oldNode = this.nodes.hasOwnProperty(key) ? this.nodes[key] : {
          isSelected: false,
          isIndeterminate: false,
          isActive: false,
          isOpen: false,
          vnode: null
        };
        const node = {
          vnode: oldNode.vnode,
          parent,
          children: children.map(c => getObjectValueByPath(c, this.itemKey)),
          item
        };
        this.buildTree(children, key);

        // This fixed bug with dynamic children resetting selected parent state
        if (this.selectionType !== 'independent' && parent !== null && !this.nodes.hasOwnProperty(key) && this.nodes.hasOwnProperty(parent)) {
          node.isSelected = this.nodes[parent].isSelected;
        } else {
          node.isSelected = oldNode.isSelected;
          node.isIndeterminate = oldNode.isIndeterminate;
        }
        node.isActive = oldNode.isActive;
        node.isOpen = oldNode.isOpen;
        this.nodes[key] = node;
        if (children.length && this.selectionType !== 'independent') {
          const {
            isSelected,
            isIndeterminate
          } = this.calculateState(key, this.nodes);
          node.isSelected = isSelected;
          node.isIndeterminate = isIndeterminate;
        }

        // Don't forget to rebuild cache
        if (this.nodes[key].isSelected && (this.selectionType === 'independent' || node.children.length === 0)) this.selectedCache.add(key);
        if (this.nodes[key].isActive) this.activeCache.add(key);
        if (this.nodes[key].isOpen) this.openCache.add(key);
        this.updateVnodeState(key);
      }
    },
    calculateState(node, state) {
      const children = state[node].children;
      const counts = children.reduce((counts, child) => {
        counts[0] += +Boolean(state[child].isSelected);
        counts[1] += +Boolean(state[child].isIndeterminate);
        return counts;
      }, [0, 0]);
      const isSelected = !!children.length && counts[0] === children.length;
      const isIndeterminate = !isSelected && (counts[0] > 0 || counts[1] > 0);
      return {
        isSelected,
        isIndeterminate
      };
    },
    emitOpen() {
      this.emitNodeCache('update:open', this.openCache);
    },
    emitSelected() {
      this.emitNodeCache('input', this.selectedCache);
    },
    emitActive() {
      this.emitNodeCache('update:active', this.activeCache);
    },
    emitNodeCache(event, cache) {
      this.$emit(event, this.returnObject ? [...cache].map(key => this.nodes[key].item) : [...cache]);
    },
    handleNodeCacheWatcher(value, cache, updateFn, emitFn) {
      value = this.returnObject ? value.map(v => getObjectValueByPath(v, this.itemKey)) : value;
      const old = [...cache];
      if (deepEqual(old, value)) return;
      old.forEach(key => updateFn(key, false));
      value.forEach(key => updateFn(key, true));
      emitFn();
    },
    getDescendants(key) {
      let descendants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      const children = this.nodes[key].children;
      descendants.push(...children);
      for (let i = 0; i < children.length; i++) {
        descendants = this.getDescendants(children[i], descendants);
      }
      return descendants;
    },
    getParents(key) {
      let parent = this.nodes[key].parent;
      const parents = [];
      while (parent !== null) {
        parents.push(parent);
        parent = this.nodes[parent].parent;
      }
      return parents;
    },
    register(node) {
      const key = getObjectValueByPath(node.item, this.itemKey);
      this.nodes[key].vnode = node;
      this.updateVnodeState(key);
    },
    unregister(node) {
      const key = getObjectValueByPath(node.item, this.itemKey);
      if (this.nodes[key]) this.nodes[key].vnode = null;
    },
    isParent(key) {
      return this.nodes[key].children && this.nodes[key].children.length;
    },
    updateActive(key, isActive) {
      if (!this.nodes.hasOwnProperty(key)) return;
      if (!this.multipleActive) {
        this.activeCache.forEach(active => {
          this.nodes[active].isActive = false;
          this.updateVnodeState(active);
          this.activeCache.delete(active);
        });
      }
      const node = this.nodes[key];
      if (!node) return;
      if (isActive) this.activeCache.add(key);else this.activeCache.delete(key);
      node.isActive = isActive;
      this.updateVnodeState(key);
    },
    updateSelected(key, isSelected) {
      let isForced = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (!this.nodes.hasOwnProperty(key)) return;
      const changed = new Map();
      if (this.selectionType !== 'independent') {
        for (const descendant of this.getDescendants(key)) {
          if (!getObjectValueByPath(this.nodes[descendant].item, this.itemDisabled) || isForced) {
            this.nodes[descendant].isSelected = isSelected;
            this.nodes[descendant].isIndeterminate = false;
            changed.set(descendant, isSelected);
          }
        }
        const calculated = this.calculateState(key, this.nodes);
        this.nodes[key].isSelected = isSelected;
        this.nodes[key].isIndeterminate = calculated.isIndeterminate;
        changed.set(key, isSelected);
        for (const parent of this.getParents(key)) {
          const calculated = this.calculateState(parent, this.nodes);
          this.nodes[parent].isSelected = calculated.isSelected;
          this.nodes[parent].isIndeterminate = calculated.isIndeterminate;
          changed.set(parent, calculated.isSelected);
        }
      } else {
        this.nodes[key].isSelected = isSelected;
        this.nodes[key].isIndeterminate = false;
        changed.set(key, isSelected);
      }
      for (const [key, value] of changed.entries()) {
        this.updateVnodeState(key);
        if (this.selectionType === 'leaf' && this.isParent(key)) continue;
        value === true ? this.selectedCache.add(key) : this.selectedCache.delete(key);
      }
    },
    updateOpen(key, isOpen) {
      if (!this.nodes.hasOwnProperty(key)) return;
      const node = this.nodes[key];
      const children = getObjectValueByPath(node.item, this.itemChildren);
      if (children && !children.length && node.vnode && !node.vnode.hasLoaded) {
        node.vnode.checkChildren().then(() => this.updateOpen(key, isOpen));
      } else if (children && children.length) {
        node.isOpen = isOpen;
        node.isOpen ? this.openCache.add(key) : this.openCache.delete(key);
        this.updateVnodeState(key);
      }
    },
    updateVnodeState(key) {
      const node = this.nodes[key];
      if (node && node.vnode) {
        node.vnode.isSelected = node.isSelected;
        node.vnode.isIndeterminate = node.isIndeterminate;
        node.vnode.isActive = node.isActive;
        node.vnode.isOpen = node.isOpen;
      }
    },
    isExcluded(key) {
      return !!this.search && this.excludedItems.has(key);
    }
  },
  render(h) {
    const children = this.items.length ? this.items.filter(item => {
      return !this.isExcluded(getObjectValueByPath(item, this.itemKey));
    }).map(item => {
      const genChild = VTreeviewNode.options.methods.genChild.bind(this);
      return genChild(item, this.disabled || getObjectValueByPath(item, this.itemDisabled));
    })
    /* istanbul ignore next */ : this.$slots.default; // TODO: remove type annotation with TS 3.2

    return h('div', {
      staticClass: 'v-treeview',
      class: {
        'v-treeview--hoverable': this.hoverable,
        'v-treeview--dense': this.dense,
        ...this.themeClasses
      }
    }, children);
  }
});
//# sourceMappingURL=VTreeview.mjs.map