import { createFieldSightHandlers } from "@/components/field-sight-plane";
import { store } from "@/model/store";

export const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minScaling: 0.125, maxScaling: 4 },
);
