import { useMemo } from "react";
import { getUnitCardDimensions } from "@/base/slot-card-dimensions";
import { store, UnitItem } from "@/central/store";
import { WiringLayerWire } from "@/editor/wiring-layer";

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
      const destSpec = item.destUnitId;
      const codes = destSpec.split("&");
      for (const code of codes) {
        const id = `${item.unitId}->${code}`;
        const p1 = getUnitPortPosition(item, "outputPort");
        const destItem = unitItemMap.get(code);
        if (!destItem) continue;
        const p2 = getUnitPortPosition(destItem, "inputPort");
        wires.push({ id, p1, p2 });
      }
    }
    return wires;
  }, [unitItems]);
}
