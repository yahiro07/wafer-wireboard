import { Point } from "mofur/ax-ui";
import { useMemo } from "react";
import { store } from "@/model/store";

export type WiringLayerWire = {
  id: string;
  p1: Point;
  p2: Point;
  rightAngled: boolean;
};

// function getUnitPortPosition(
//   item: UnitItem,
//   targetKey: "inputPort" | "outputPort",
// ) {
//   const sd = getUnitCardDimensions(item.unitId);
//   return {
//     x: item.position.x - sd.width / 2 + sd[targetKey].x,
//     y: item.position.y - sd.height / 2 + sd[targetKey].y,
//   };
// }

// export function useWiringLayerWireItems() {
//   const { unitItems } = store.useSnapshot();
//   return useMemo(() => {
//     const unitItemMap = new Map(unitItems.map((item) => [item.unitId, item]));
//     const wires: WiringLayerWire[] = [];
//     for (const item of unitItems) {
//       if (!item.destSpec) continue;
//       const destSpec = item.destSpec;
//       const codes = destSpec.$primary;
//       for (const code of codes) {
//         const id = `${item.unitId}->${code}`;
//         const p1 = getUnitPortPosition(item, "outputPort");
//         const destItem = unitItemMap.get(code);
//         if (!destItem) continue;
//         const p2 = getUnitPortPosition(destItem, "inputPort");
//         const rightAngled = code === "builtInPreOutput";
//         wires.push({ id, p1, p2, rightAngled });
//       }
//     }
//     return wires;
//   }, [unitItems]);
// }

export function useWiringLayerWireItems(): WiringLayerWire[] {
  const { wireItems, portItems } = store.useSnapshot();
  return useMemo(
    () =>
      wireItems.map((wire) => {
        const id = wire.connectionKey;
        const p1 = portItems[wire.sourcePortKey].position;
        const p2 = portItems[wire.destinationPortKey].position;
        const rightAngled = wire.destinationPortKey === "builtInPreOutput";
        return { id, p1, p2, rightAngled };
      }),
    [wireItems, portItems],
  );
  // const unitItemMap = new Map(unitItems.map((item) => [item.unitId, item]));
  // const wires: WiringLayerWire[] = [];
  // for (const item of unitItems) {
  //   if (!item.destSpec) continue;
  //   const destSpec = item.destSpec;
  //   const codes = destSpec.$primary;
  //   for (const code of codes) {
  //     const id = `${item.unitId}->${code}`;
  //     const p1 = getUnitPortPosition(item, "outputPort");
  //     const destItem = unitItemMap.get(code);
  //     if (!destItem) continue;
  //     const p2 = getUnitPortPosition(destItem, "inputPort");
  //     const rightAngled = code === "builtInPreOutput";
  //     wires.push({ id, p1, p2, rightAngled });
  //   }
  // }
  // return wires;
}
