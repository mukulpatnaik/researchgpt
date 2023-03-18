// Composables
import { makeItemsProps, useItems } from "../../../composables/items.mjs"; // Utilities
import { computed } from 'vue';
import { getPropertyFromItem, propsFactory } from "../../../util/index.mjs"; // Types
export const makeDataTableItemProps = propsFactory({
  // TODO: Worth it to make specific datatable implementation
  // without title, children?
  ...makeItemsProps({
    itemValue: 'id'
  })
}, 'v-data-table-item');
export function useDataTableItems(props, columns) {
  const {
    items
  } = useItems(props);
  const dataTableItems = computed(() => items.value.map(item => {
    return {
      ...item,
      type: 'item',
      columns: columns.value.reduce((obj, column) => {
        obj[column.key] = getPropertyFromItem(item.raw, column.value ?? column.key);
        return obj;
      }, {})
    };
  }));
  return {
    items: dataTableItems
  };
}
//# sourceMappingURL=items.mjs.map