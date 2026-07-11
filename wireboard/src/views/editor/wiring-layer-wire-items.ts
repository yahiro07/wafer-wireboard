import { Point } from "mofur/ax-ui";
import { useMemo } from "react";
import { HsPortSubtype } from "wafer-host/core";
import { store } from "@/model/store";

export type WiringLayerWire = {
  id: string;
  p1: Point;
  p2: Point;
  hmrRevision: number;
  signalType: HsPortSubtype;
};

export function useWiringLayerWireItems(): WiringLayerWire[] {
  const { wireItems, portItems, hideWarpedWires } = store.useSnapshot();
  return useMemo(
    () =>
      wireItems
        .map((wire) => {
          const id = wire.connectionKey;
          const p1 = portItems[wire.sourcePortKey]?.position;
          const p2 = portItems[wire.destinationPortKey]?.position;
          const hmrRevision = wire.hmrRevision ?? 0;
          if (hideWarpedWires) {
            if (
              wire.sourcePortKey.includes("warpMixEmitter") ||
              wire.destinationPortKey.includes("warpMixReceiver")
              // (wire.sourcePortKey.includes("aux") ||
              //   wire.destinationPortKey.includes("aux"))
            ) {
              return undefined;
            }
          }
          if (p1 && p2) {
            const signalType = portItems[wire.sourcePortKey]?.subtype;
            return { id, p1, p2, hmrRevision, signalType };
          }
          return undefined;
        })
        .filter(Boolean) as WiringLayerWire[],
    [wireItems, portItems, hideWarpedWires],
  );
}
