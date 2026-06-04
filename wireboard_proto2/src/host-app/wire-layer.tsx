import { Point } from "beams/ax-ui/common-types";
import { useMemo } from "react";
import {
  getPortKey,
  getUnitIdFromPortKey,
  mapDestSpecToPortKeys,
} from "@/host-app/common";
import { store } from "@/host-app/store";
import { PortItem, UnitItem } from "@/host-app/types";

type WireKind = "normal" | "previewConnecting" | "previewDisconnecting";

type WirePath = {
  key: string;
  d: string;
  wireKind: WireKind;
};

type WireConnection = {
  key: string;
  sourcePortKey: string;
  targetPortKey: string;
  wireKind: WireKind;
};

function getConnectionPairs(unitItems: UnitItem[]): WireConnection[] {
  const connections: WireConnection[] = [];

  for (const { unitId, destSpec } of unitItems) {
    if (!destSpec) {
      continue;
    }
    if (destSpec.includes("|")) {
      destSpec.split("|").forEach((spec, outputIndex) => {
        const sourcePortKey = getPortKey(unitId, "output", outputIndex);
        const targetPortKeys = mapDestSpecToPortKeys(spec);
        targetPortKeys.forEach((targetPortKey) => {
          connections.push({
            key: `${sourcePortKey}->${targetPortKey}`,
            sourcePortKey: sourcePortKey,
            targetPortKey,
            wireKind: "normal",
          });
        });
      });
    } else {
      const sourcePortKey = getPortKey(unitId, "output");
      const targetPortKeys = mapDestSpecToPortKeys(destSpec);
      targetPortKeys.forEach((targetPortKey) => {
        connections.push({
          key: `${sourcePortKey}->${targetPortKey}`,
          sourcePortKey: sourcePortKey,
          targetPortKey,
          wireKind: "normal",
        });
      });
    }
  }
  return connections;
}

function buildWirePath(start: Point, end: Point): string {
  const distance = Math.abs(end.y - start.y);
  const bend = Math.max(distance * 0.5, 80);
  const control1Y = start.y - bend;
  const control2Y = end.y + bend;
  return `M ${start.x} ${start.y} C ${start.x} ${control1Y}, ${end.x} ${control2Y}, ${end.x} ${end.y}`;
}

function getPortPosition(
  unitItems: UnitItem[],
  portItems: Record<string, PortItem>,
  portKey: string,
): Point | undefined {
  const portItem = portItems[portKey];
  if (!portItem) {
    return undefined;
  }
  const unitId = getUnitIdFromPortKey(portKey);
  const unitItem = unitItems.find((item) => item.unitId === unitId);
  if (!unitItem) {
    return undefined;
  }
  return {
    x: unitItem.position.x + portItem.relativePositionInUnit.x,
    y: unitItem.position.y + portItem.relativePositionInUnit.y,
  };
}

function usePreviewConnection(): WireConnection | undefined {
  const { draggingPortKey, previewDestPortKey } = store.useSnapshot();
  return useMemo(() => {
    if (
      draggingPortKey &&
      previewDestPortKey &&
      draggingPortKey !== previewDestPortKey
    ) {
      return {
        sourcePortKey: draggingPortKey,
        targetPortKey: previewDestPortKey,
        key: `${draggingPortKey}->${previewDestPortKey}`,
        wireKind: "previewConnecting",
      };
    } else {
      return undefined;
    }
  }, [draggingPortKey, previewDestPortKey]);
}

function mergeConnections(
  connections: WireConnection[],
  previewConnection: WireConnection | undefined,
): WireConnection[] {
  if (!previewConnection) {
    return connections;
  }
  const existingPreviewConnection = connections.find(
    (conn) => conn.key === previewConnection.key,
  );
  return [
    ...connections.filter((conn) => conn !== existingPreviewConnection),
    {
      ...previewConnection,
      wireKind: existingPreviewConnection
        ? "previewDisconnecting"
        : "previewConnecting",
    },
  ];
}

function useWirePaths(): WirePath[] {
  const { unitItems, portItems } = store.useSnapshot();
  const connections = useMemo(() => getConnectionPairs(unitItems), [unitItems]);
  const previewConnection = usePreviewConnection();
  return useMemo(() => {
    const mergedConnections = mergeConnections(connections, previewConnection);
    return mergedConnections
      .map((conn) => {
        const start = getPortPosition(unitItems, portItems, conn.sourcePortKey);
        const end = getPortPosition(unitItems, portItems, conn.targetPortKey);
        return start && end
          ? {
              key: conn.key,
              d: buildWirePath(start, end),
              wireKind: conn.wireKind,
            }
          : undefined;
      })
      .filter(Boolean) as WirePath[];
  }, [connections, unitItems, portItems, previewConnection]);
}

export const WireLayer = () => {
  const wirePaths = useWirePaths();
  return (
    <svg className="absolute inset-0 z-0 block w-full h-full pointer-events-none overflow-visible">
      {wirePaths.map((wirePath) => {
        let color = "currentColor";
        if (wirePath.wireKind === "previewConnecting") {
          color = "#0f0";
        } else if (wirePath.wireKind === "previewDisconnecting") {
          color = "#f00";
        }
        return (
          <path
            key={wirePath.key}
            d={wirePath.d}
            fill="none"
            stroke={color}
            strokeWidth="25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-700 opacity-80"
          />
        );
      })}
    </svg>
  );
};
