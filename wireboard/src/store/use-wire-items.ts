import { useMemo } from "react";
import { WiringLayerWire } from "@/components-ex/wiring-layer";
import { portRelativePositions } from "@/organisms/slot-card-box";
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
      const rps = portRelativePositions;
      const p1 = {
        x: item.position.x + rps.outputPort.x,
        y: item.position.y + rps.outputPort.y,
      };
      const p2 = {
        x: destItem.position.x + rps.inputPort.x,
        y: destItem.position.y + rps.inputPort.y,
      };
      wires.push({ id, p1, p2 });
    }
    return wires;
  }, [unitItems]);
}
