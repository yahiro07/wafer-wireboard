import { createWireItem } from "@/model/factory";
import { store } from "@/model/store";

export const connectionLogic = {
  setConnectionSingle(sourcePortKey: string, destinationPortKey: string) {
    const newWire = createWireItem(sourcePortKey, destinationPortKey);
    const newWireItems = [
      ...store.state.wireItems.filter(
        (wire) => wire.sourcePortKey !== sourcePortKey,
      ),
      newWire,
    ];
    store.setWireItems(newWireItems);
  },
  toggleConnectionSingle(sourcePortKey: string, destinationPortKey: string) {
    const existingWireItem = store.state.wireItems.find(
      (wire) => wire.sourcePortKey === sourcePortKey,
    );
    if (existingWireItem) {
      store.setWireItems((prev) =>
        prev.filter((wire) => wire.sourcePortKey !== sourcePortKey),
      );
    } else {
      const newWire = createWireItem(sourcePortKey, destinationPortKey);
      store.setWireItems((prev) => [...prev, newWire]);
    }
  },
  toggleConnectionInFanOut(sourcePortKey: string, destinationPortKey: string) {
    const connectionKey = `${sourcePortKey}-${destinationPortKey}`;
    const existingWireItem = store.state.wireItems.find(
      (wire) => wire.connectionKey === connectionKey,
    );
    if (existingWireItem) {
      store.setWireItems((prev) =>
        prev.filter((wire) => wire.connectionKey !== connectionKey),
      );
    } else {
      const newWire = createWireItem(sourcePortKey, destinationPortKey);
      store.setWireItems((prev) => [...prev, newWire]);
    }
  },
};
