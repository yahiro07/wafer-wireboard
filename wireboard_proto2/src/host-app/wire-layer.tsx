import { Point } from "beams/ax-ui/common-types";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { UnitItem } from "@/host-app/types";

type WirePath = {
  key: string;
  d: string;
};

const isPrimaryDestSpec = (destSpec: string) => {
  return !destSpec.startsWith("$") && !destSpec.includes(".");
};

const getConnectionPairs = (unitItems: UnitItem[]) => {
  const unitIdSet = new Set(unitItems.map(({ unitId }) => unitId));
  const connections: Array<{ sourceId: string; targetId: string }> = [];

  for (const { unitId, destSpec } of unitItems) {
    const destList = Array.isArray(destSpec) ? destSpec : [destSpec];

    for (const dest of destList) {
      if (!dest || !isPrimaryDestSpec(dest)) {
        continue;
      }

      if (!unitIdSet.has(dest)) {
        continue;
      }

      connections.push({ sourceId: unitId, targetId: dest });
    }
  }

  return connections;
};

const getPortCenter = (portId: string, originRect: DOMRect) => {
  const element = document.getElementById(`dom_unit_port_${portId}`);
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - originRect.left,
    y: rect.top + rect.height / 2 - originRect.top,
  };
};

const buildWirePath = (start: Point, end: Point) => {
  const distance = Math.abs(end.x - start.x);
  const bend = Math.max(distance * 0.5, 80);
  const direction = end.x >= start.x ? 1 : -1;
  const control1X = start.x + direction * bend;
  const control2X = end.x - direction * bend;

  return `M ${start.x} ${start.y} C ${control1X} ${start.y}, ${control2X} ${end.y}, ${end.x} ${end.y}`;
};

export const WireLayer = ({ unitItems }: { unitItems: UnitItem[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [wirePaths, setWirePaths] = useState<WirePath[]>([]);

  const connections = useMemo(() => getConnectionPairs(unitItems), [unitItems]);

  useLayoutEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return;
    }

    const updateWirePaths = () => {
      const originRect = svgElement.getBoundingClientRect();
      const nextWirePaths: WirePath[] = [];

      for (const { sourceId, targetId } of connections) {
        const start = getPortCenter(`${sourceId}_output`, originRect);
        const end = getPortCenter(`${targetId}_input`, originRect);

        if (!start || !end) {
          continue;
        }

        nextWirePaths.push({
          key: `${sourceId}->${targetId}`,
          d: buildWirePath(start, end),
        });
      }

      setWirePaths(nextWirePaths);
    };

    updateWirePaths();

    const resizeObserver = new ResizeObserver(() => {
      updateWirePaths();
    });

    const observedBoxElements = new Set<Element>();

    for (const { unitId } of unitItems) {
      const portElement = document.getElementById(
        `dom_unit_port_${unitId}_output`,
      );
      const boxElement = portElement?.parentElement?.parentElement;

      if (!boxElement || observedBoxElements.has(boxElement)) {
        continue;
      }

      observedBoxElements.add(boxElement);
      resizeObserver.observe(boxElement);
    }

    resizeObserver.observe(svgElement);
    window.addEventListener("resize", updateWirePaths);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWirePaths);
    };
  }, [connections, unitItems]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 z-0 block w-full h-full pointer-events-none overflow-visible"
    >
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
