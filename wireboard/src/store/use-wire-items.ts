import { useMemo } from "react";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { WiringLayerWire } from "@/components-ex/wiring-layer";
import { store } from "@/store/store";

export function useWireItems() {
  const { unitItems, speakerPortPos } = store.useSnapshot();
  return useMemo(() => {
    const unitItemMap = new Map(unitItems.map((item) => [item.unitId, item]));
    const wires: WiringLayerWire[] = [];
    for (const item of unitItems) {
      if (!item.destUnitId) continue;

      const id = `${item.unitId}->${item.destUnitId}`;
      const sd = slotCardDimensions;
      const p1 = {
        x: item.position.x - sd.width / 2 + sd.outputPort.x,
        y: item.position.y - sd.height / 2 + sd.outputPort.y,
      };

      if (item.destUnitId === "$output") {
        wires.push({ id, p1, p2: speakerPortPos });
        continue;
      }
      const destItem = unitItemMap.get(item.destUnitId);
      if (!destItem) continue;
      const p2 = {
        x: destItem.position.x - sd.width / 2 + sd.inputPort.x,
        y: destItem.position.y - sd.height / 2 + sd.inputPort.y,
      };
      wires.push({ id, p1, p2 });
    }
    return wires;
  }, [unitItems, speakerPortPos]);
}
