// Utilities
import { isComponentInstance } from "../util/index.mjs";
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Types

export function useMutationObserver(handler, options) {
  const mutationRef = ref();
  const {
    once,
    immediate,
    ...optionKeys
  } = options || {};
  const defaultValue = !Object.keys(optionKeys).length;
  const observer = new MutationObserver((mutations, observer) => {
    handler?.(mutations, observer);
    if (options?.once) observer.disconnect();
  });
  onMounted(() => {
    if (!options?.immediate) return;
    handler?.([], observer);
  });
  onBeforeUnmount(() => {
    observer.disconnect();
  });
  watch(mutationRef, (newValue, oldValue) => {
    if (oldValue) observer.disconnect();
    const el = isComponentInstance(newValue) ? newValue.$el : newValue;
    if (!el) return;
    observer.observe(el, {
      attributes: options?.attr ?? defaultValue,
      characterData: options?.char ?? defaultValue,
      childList: options?.child ?? defaultValue,
      subtree: options?.sub ?? defaultValue
    });
  }, {
    flush: 'post'
  });
  return {
    mutationRef
  };
}
//# sourceMappingURL=mutationObserver.mjs.map