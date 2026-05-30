import { useMemo } from "react";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { WiringLayerWire } from "@/components-ex/wiring-layer";
import { store } from "@/store/store";

export function useWireItems() {
  const { unitItems } = store.useSnapshot();
  return useMemo(() => {
    const unitItemMap = new Map(unitItems.map((item) => [item.unitId, item]));
    const wires: WiringLayerWire[] = [];
    for (const item of unitItems) {
      if (!item.destUnitId) continue;
      const destItem = unitItemMap.get(item.destUnitId);
      if (!destItem) continue;
      const id = `${item.unitId}->${item.destUnitId}`;
      const dim = slotCardDimensions;
      const p1 = {
        x: item.position.x + dim.outputPort.x,
        y: item.position.y + dim.outputPort.y,
      };
      const p2 = {
        x: destItem.position.x + dim.inputPort.x,
        y: destItem.position.y + dim.inputPort.y,
      };
      wires.push({ id, p1, p2 });
    }
    return wires;
  }, [unitItems]);
}
