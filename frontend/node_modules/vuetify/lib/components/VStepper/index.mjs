import { createSimpleFunctional } from "../../util/index.mjs";
import VStepper from "./VStepper.mjs";
import VStepperStep from "./VStepperStep.mjs";
import VStepperContent from "./VStepperContent.mjs";
const VStepperHeader = createSimpleFunctional('v-stepper__header');
const VStepperItems = createSimpleFunctional('v-stepper__items');
export { VStepper, VStepperContent, VStepperStep, VStepperHeader, VStepperItems };
export default {
  $_vuetify_subcomponents: {
    VStepper,
    VStepperContent,
    VStepperStep,
    VStepperHeader,
    VStepperItems
  }
};
//# sourceMappingURL=index.mjs.map