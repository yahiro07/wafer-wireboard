import { Point } from "beams/ax-ui/common-types";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  getDomPortCellId,
  getPortKey,
  mapDestSpecToPortKeys,
} from "@/host-app/common";
import { UnitItem } from "@/host-app/types";

type WirePath = {
  key: string;
  d: string;
};

type WireConnection = {
  key: string;
  sourcePortKey: string;
  targetPortKey: string;
};

const getConnectionPairs = (unitItems: UnitItem[]) => {
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
};

const getPortCenter = (portKey: string, originRect: DOMRect) => {
  const id = getDomPortCellId(portKey);
  const element = document.getElementById(id);
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
  const distance = Math.abs(end.y - start.y);
  const bend = Math.max(distance * 0.5, 80);
  const control1Y = start.y - bend;
  const control2Y = end.y + bend;

  return `M ${start.x} ${start.y} C ${start.x} ${control1Y}, ${end.x} ${control2Y}, ${end.x} ${end.y}`;
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

      for (const { sourcePortKey, targetPortKey, key } of connections) {
        const start = getPortCenter(sourcePortKey, originRect);
        const end = getPortCenter(targetPortKey, originRect);

        if (!start || !end) {
          continue;
        }

        nextWirePaths.push({
          key,
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
      const portKey = getPortKey(unitId, "output");
      const domPortCellId = getDomPortCellId(portKey);
      const portElement = document.getElementById(domPortCellId);
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
