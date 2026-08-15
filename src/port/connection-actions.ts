import { Point } from "@/auxiliaries/common-types";
import { store } from "@/model/store";
import { PortItem } from "@/model/types";

export const connectionActions = {
  addPortItem(portItem: PortItem) {
    store.setPortItems((prev) => ({ ...prev, [portItem.portKey]: portItem }));
  },
  removePortItem(portKey: string) {
    store.producePortItems((draft) => {
      delete draft[portKey];
    });
  },
  setPortItemPosition(portKey: string, position: Point) {
    store.producePortItems((draft) => {
      draft[portKey].position = position;
    });
  },
  setDraggingPortKey(portKey: string | null) {
    store.setDraggingPortKey(portKey);
  },
  setPreviewDestPortKey(portKey: string | null) {
    store.setPreviewDestPortKey(portKey);
  },
  setTappingPortKey(portKey: string | null) {
    store.setTappingPortKey(portKey);
  },
};
