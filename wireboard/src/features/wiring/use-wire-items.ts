import { useMemo } from "react";
import { getUnitCardDimensions } from "@/base/slot-card-dimensions";
import { WiringLayerWire } from "@/features/wiring/wiring-layer";
import { store, UnitItem } from "@/store/store";

function getUnitPortPosition(
  item: UnitItem,
  targetKey: "inputPort" | "outputPort",
) {
  const sd = getUnitCardDimensions(item.unitId);
  return {
    x: item.position.x - sd.width / 2 + sd[targetKey].x,
    y: item.position.y - sd.height / 2 + sd[targetKey].y,
  };
}

export function useWireItems() {
  const { unitItems } = store.useSnapshot();
  return useMemo(() => {
    const unitItemMap = new Map(unitItems.map((item) => [item.unitId, item]));
    const wires: WiringLayerWire[] = [];
    for (const item of unitItems) {
      if (!item.destUnitId) continue;
      const id = `${item.unitId}->${item.destUnitId}`;
      const p1 = getUnitPortPosition(item, "outputPort");
      const destItem = unitItemMap.get(item.destUnitId);
      if (!destItem) continue;
      const p2 = getUnitPortPosition(destItem, "inputPort");
      wires.push({ id, p1, p2 });
    }
    return wires;
  }, [unitItems]);
}
