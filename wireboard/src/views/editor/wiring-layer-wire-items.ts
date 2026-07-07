import { Point } from "mofur/ax-ui";
import { useMemo } from "react";
import { store } from "@/model/store";

export type WiringLayerWire = {
  id: string;
  p1: Point;
  p2: Point;
  rightAngled: boolean;
  hmrRevision: number;
};

export function useWiringLayerWireItems(): WiringLayerWire[] {
  const { wireItems, portItems } = store.useSnapshot();
  return useMemo(
    () =>
      wireItems
        .map((wire) => {
          const id = wire.connectionKey;
          const p1 = portItems[wire.sourcePortKey]?.position;
          const p2 = portItems[wire.destinationPortKey]?.position;
          const hmrRevision = wire.hmrRevision ?? 0;
          if (p1 && p2) {
            const rightAngled =
              wire.destinationPortKey === "builtInPreOutput.primaryInput";
            return { id, p1, p2, rightAngled, hmrRevision };
          }
          return undefined;
        })
        .filter(Boolean) as WiringLayerWire[],
    [wireItems, portItems],
  );
}
