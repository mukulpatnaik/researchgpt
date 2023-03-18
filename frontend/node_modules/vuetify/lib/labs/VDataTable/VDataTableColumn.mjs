import { createVNode as _createVNode, mergeProps as _mergeProps } from "vue";
import { convertToUnit, defineFunctionalComponent } from "../../util/index.mjs";
export const VDataTableColumn = defineFunctionalComponent({
  align: {
    type: String,
    default: 'start'
  },
  fixed: Boolean,
  fixedOffset: [Number, String],
  height: [Number, String],
  lastFixed: Boolean,
  noPadding: Boolean,
  tag: String,
  width: [Number, String]
}, (props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  const Tag = props.tag ?? 'td';
  return _createVNode(Tag, _mergeProps({
    "class": ['v-data-table__td', {
      'v-data-table-column--fixed': props.fixed,
      'v-data-table-column--last-fixed': props.lastFixed,
      'v-data-table-column--no-padding': props.noPadding
    }, `v-data-table-column--align-${props.align}`],
    "style": {
      height: convertToUnit(props.height),
      width: convertToUnit(props.width),
      left: convertToUnit(props.fixedOffset || null)
    }
  }, attrs), {
    default: () => [slots.default?.()]
  });
});
//# sourceMappingURL=VDataTableColumn.mjs.map