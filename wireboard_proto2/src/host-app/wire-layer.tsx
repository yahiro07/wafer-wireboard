import { Point } from "beams/ax-ui/common-types";
import { useMemo } from "react";
import { getPortKey, mapDestSpecToPortKeys } from "@/host-app/common";
import { store } from "@/host-app/store";
import { PortItem, UnitItem } from "@/host-app/types";

type WirePath = {
  key: string;
  d: string;
};

type WireConnection = {
  key: string;
  sourcePortKey: string;
  targetPortKey: string;
};

function getConnectionPairs(unitItems: UnitItem[]): WireConnection[] {
  const connections: WireConnection[] = [];

  for (const { unitId, destSpec } of unitItems) {
    if (!destSpec) {
      continue;
    }
    if (Array.isArray(destSpec)) {
      destSpec.forEach((spec, outputIndex) => {
        const sourcePortKey = getPortKey(unitId, "output", outputIndex);
        const targetPortKeys = mapDestSpecToPortKeys(spec);
        targetPortKeys.forEach((targetPortKey) => {
          connections.push({
            key: `${sourcePortKey}->${targetPortKey}`,
            sourcePortKey: sourcePortKey,
            targetPortKey,
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

function useWirePaths(
  unitItems: UnitItem[],
  portItems: Record<string, PortItem>,
): WirePath[] {
  const connections = useMemo(() => getConnectionPairs(unitItems), [unitItems]);
  return useMemo(() => {
    return connections
      .map(({ sourcePortKey, targetPortKey, key }) => {
        const start = portItems[sourcePortKey]?.position;
        const end = portItems[targetPortKey]?.position;
        return start && end && { key, d: buildWirePath(start, end) };
      })
      .filter(Boolean);
  }, [connections, portItems]);
}

export const WireLayer = () => {
  const { unitItems, portItems } = store.useSnapshot();
  const wirePaths = useWirePaths(unitItems, portItems);
  return (
    <svg className="absolute inset-0 z-0 block w-full h-full pointer-events-none overflow-visible">
      {wirePaths.map((wirePath) => (
        <path
          key={wirePath.key}
          d={wirePath.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-700 opacity-80"
        />
      ))}
    </svg>
  );
};
