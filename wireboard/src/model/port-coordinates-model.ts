import { Point } from "mofur/ax-ui";
import { store } from "@/model/store";
import { PortItem } from "@/model/types";

function createPortCoordinatesModel() {
  return {
    addPortItem(portItem: PortItem) {
      store.setPortItems((prev) => [...prev, portItem]);
    },
    removePortItem(portKey: string) {
      store.setPortItems((prev) =>
        prev.filter((item) => item.portKey !== portKey),
      );
    },
    setPortItemPosition(portKey: string, position: Point) {
      store.setPortItems((prev) =>
        prev.map((item) =>
          item.portKey === portKey ? { ...item, position } : item,
        ),
      );
    },
  };
}

export const portCoordinatesModel = createPortCoordinatesModel();
