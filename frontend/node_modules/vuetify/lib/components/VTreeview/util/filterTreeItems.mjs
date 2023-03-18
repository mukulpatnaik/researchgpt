// @ts-nocheck
/* eslint-disable */
import { getObjectValueByPath } from "../../../util/helpers.mjs";
export function filterTreeItem(item, search, textKey) {
  const text = getObjectValueByPath(item, textKey);
  return text.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1;
}
export function filterTreeItems(filter, item, search, idKey, textKey, childrenKey, excluded) {
  if (filter(item, search, textKey)) {
    return true;
  }
  const children = getObjectValueByPath(item, childrenKey);
  if (children) {
    let match = false;
    for (let i = 0; i < children.length; i++) {
      if (filterTreeItems(filter, children[i], search, idKey, textKey, childrenKey, excluded)) {
        match = true;
      }
    }
    if (match) return true;
  }
  excluded.add(getObjectValueByPath(item, idKey));
  return false;
}
//# sourceMappingURL=filterTreeItems.mjs.map