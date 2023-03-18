// Utilities
import { onMounted, ref } from 'vue';
import { IN_BROWSER } from "../util/index.mjs";
import { useDisplay } from "./display.mjs";
export function useHydration() {
  if (!IN_BROWSER) return ref(false);
  const {
    ssr
  } = useDisplay();
  if (ssr) {
    const isMounted = ref(false);
    onMounted(() => {
      isMounted.value = true;
    });
    return isMounted;
  } else {
    return ref(true);
  }
}
//# sourceMappingURL=hydration.mjs.map