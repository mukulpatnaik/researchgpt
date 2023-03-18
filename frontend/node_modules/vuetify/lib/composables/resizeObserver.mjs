// Utilities
import { onBeforeUnmount, readonly, ref, watch } from 'vue';
// Globals
import { IN_BROWSER } from "../util/globals.mjs";
export function useResizeObserver(callback) {
  const resizeRef = ref();
  const contentRect = ref();
  if (IN_BROWSER) {
    const observer = new ResizeObserver(entries => {
      callback?.(entries, observer);
      if (!entries.length) return;
      contentRect.value = entries[0].contentRect;
    });
    onBeforeUnmount(() => {
      observer.disconnect();
    });
    watch(resizeRef, (newValue, oldValue) => {
      if (oldValue) {
        observer.unobserve(oldValue);
        contentRect.value = undefined;
      }
      if (newValue) observer.observe(newValue);
    }, {
      flush: 'post'
    });
  }
  return {
    resizeRef,
    contentRect: readonly(contentRect)
  };
}
//# sourceMappingURL=resizeObserver.mjs.map