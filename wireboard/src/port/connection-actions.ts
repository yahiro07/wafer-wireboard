import { actionsInternal } from "@/model/actions";
import { store } from "@/model/store";
import { AppUnitDestinationSpec } from "@/model/types";

export const connectionActions = {
  setDraggingPortKey(portKey: string | null) {
    store.setDraggingPortKey(portKey);
  },
  setPreviewDestPortKey(portKey: string | null) {
    store.setPreviewDestPortKey(portKey);
  },
  setTappingPortKey(portKey: string | null) {
    store.setTappingPortKey(portKey);
  },
  replaceUnitDestSpec(unitId: string, destSpec: AppUnitDestinationSpec) {
    actionsInternal.patchUnitItem(unitId, { destSpec });
  },
  removeConnection(unitId: string) {
    actionsInternal.patchUnitItem(unitId, { destSpec: undefined });
  },
};
