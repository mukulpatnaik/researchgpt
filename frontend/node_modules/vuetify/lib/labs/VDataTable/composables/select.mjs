// Composables
import { useProxiedModel } from "../../../composables/proxiedModel.mjs"; // Utilities
import { computed, inject, provide } from 'vue';
import { propsFactory } from "../../../util/index.mjs"; // Types
export const makeDataTableSelectProps = propsFactory({
  showSelect: Boolean,
  modelValue: {
    type: Array,
    default: () => []
  }
}, 'v-data-table-select');
export const VDataTableSelectionSymbol = Symbol.for('vuetify:data-table-selection');
export function createSelection(props, allItems) {
  const selected = useProxiedModel(props, 'modelValue', props.modelValue, v => {
    return new Set(v);
  }, v => {
    return [...v.values()];
  });
  function isSelected(items) {
    return items.every(item => selected.value.has(item.value));
  }
  function isSomeSelected(items) {
    return items.some(item => selected.value.has(item.value));
  }
  function select(items, value) {
    const newSelected = new Set(selected.value);
    for (const item of items) {
      if (value) newSelected.add(item.value);else newSelected.delete(item.value);
    }
    selected.value = newSelected;
  }
  function toggleSelect(item) {
    select([item], !isSelected([item]));
  }
  function selectAll(value) {
    select(allItems.value, value);
  }
  const someSelected = computed(() => selected.value.size > 0);
  const allSelected = computed(() => isSelected(allItems.value));
  const data = {
    toggleSelect,
    select,
    selectAll,
    isSelected,
    isSomeSelected,
    someSelected,
    allSelected
  };
  provide(VDataTableSelectionSymbol, data);
  return data;
}
export function useSelection() {
  const data = inject(VDataTableSelectionSymbol);
  if (!data) throw new Error('Missing selection!');
  return data;
}
//# sourceMappingURL=select.mjs.map