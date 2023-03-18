// Utilities
import { computed, ref, watch } from 'vue';

// Types
import { propsFactory } from "../util/index.mjs";
export const makeLazyProps = propsFactory({
  eager: Boolean
}, 'lazy');
export function useLazy(props, active) {
  const isBooted = ref(false);
  const hasContent = computed(() => isBooted.value || props.eager || active.value);
  watch(active, () => isBooted.value = true);
  function onAfterLeave() {
    if (!props.eager) isBooted.value = false;
  }
  return {
    isBooted,
    hasContent,
    onAfterLeave
  };
}
//# sourceMappingURL=lazy.mjs.map