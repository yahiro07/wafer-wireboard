import { Point } from "mofur/ax-ui";
import { useMemo } from "react";
import { store } from "@/model/store";

type WireRouteType = "normal" | "diagonal" | "diagonal2";

export type WiringLayerWire = {
  id: string;
  p1: Point;
  p2: Point;
  routeType: WireRouteType;
  hmrRevision: number;
};

function getRouteType(
  sourcePortKey: string,
  destinationPortKey: string,
): WireRouteType {
  if (
    sourcePortKey.includes("warpMixEmitter") ||
    destinationPortKey.includes("warpMixReceiver")
  ) {
    return "diagonal";
  }
  if (destinationPortKey === "builtInPreOutput.primaryInput") {
    return "diagonal2";
  }
  return "normal";
}

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
            const routeType = getRouteType(
              wire.sourcePortKey,
              wire.destinationPortKey,
            );
            return { id, p1, p2, routeType, hmrRevision };
          }
          return undefined;
        })
        .filter(Boolean) as WiringLayerWire[],
    [wireItems, portItems, hideWarpedWires],
  );
}
