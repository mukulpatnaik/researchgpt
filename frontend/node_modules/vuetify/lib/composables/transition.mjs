// Utilities
import { h, mergeProps, Transition } from 'vue';
import { propsFactory } from "../util/index.mjs"; // Types
export const makeTransitionProps = propsFactory({
  transition: {
    type: [Boolean, String, Object],
    default: 'fade-transition',
    validator: val => val !== true
  }
}, 'transition');
export const MaybeTransition = (props, _ref) => {
  let {
    slots
  } = _ref;
  const {
    transition,
    ...rest
  } = props;
  const {
    component = Transition,
    ...customProps
  } = typeof transition === 'object' ? transition : {};
  return h(component, mergeProps(typeof transition === 'string' ? {
    name: transition
  } : customProps, rest), slots);
};
//# sourceMappingURL=transition.mjs.map