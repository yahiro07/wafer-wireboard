import { Point } from "@/auxiliaries/common-types";
import { useMemo } from "react";
import { HsPortSubtype } from "wafer-host/core";
import { store } from "@/model/store";

export type WiringLayerWire = {
  id: string;
  p1: Point;
  p2: Point;
  hmrRevision: number;
  signalType: HsPortSubtype;
  weaken: boolean;
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

          if (p1 && p2) {
            const hmrRevision = wire.hmrRevision ?? 0;
            const signalType = portItems[wire.sourcePortKey]?.subtype;
            const weaken =
              hideWarpedWires &&
              (wire.sourcePortKey.includes("warpMixEmitter") ||
                wire.destinationPortKey.includes("warpMixReceiver"));
            return { id, p1, p2, hmrRevision, signalType, weaken };
          }
          return undefined;
        })
        .filter(Boolean) as WiringLayerWire[],
    [wireItems, portItems, hideWarpedWires],
  );
}
