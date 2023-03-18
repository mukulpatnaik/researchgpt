import { getCurrentInstance } from "./getCurrentInstance.mjs";
export function injectSelf(key) {
  const {
    provides
  } = getCurrentInstance('injectSelf');
  if (provides && key in provides) {
    // TS doesn't allow symbol as index type
    return provides[key];
  }
}
//# sourceMappingURL=injectSelf.mjs.map