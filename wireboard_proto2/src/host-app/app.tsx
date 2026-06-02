import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { Point } from "beams/ax-ui/common-types";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "@/framework/unit-frame/react-unit-interface";
import { UnitBox } from "@/host-app/organisms/unit-box";
import { reactUnitFactories } from "@/units/react";

type UnitItem = {
  unitId: string;
  pageUrl?: string;
  unitTemplateFn?: ReactUnitTemplateFn;
  destSpec?: string | string[];
  position: Point;
};

const uf = reactUnitFactories;

const unitItemsDefault: UnitItem[] = [
  {
    unitId: "mixer1",
    unitTemplateFn: uf.mixer,
    destSpec: "$output",
    position: { x: 400, y: 0 },
  },
  {
    unitId: "osc1",
    pageUrl: "/units/osc/index.html",
    destSpec: "mixer1.port0",
    position: { x: 100, y: 150 },
  },
  {
    unitId: "osc2",
    unitTemplateFn: uf.osc,
    destSpec: "mixer1.port1",
    position: { x: 400, y: 180 },
  },
  {
    unitId: "cvGateOsc1",
    unitTemplateFn: uf.cvGateOsc,
    destSpec: "mixer1.port2",
    position: { x: 700, y: 150 },
  },
  {
    unitId: "keyboard1",
    unitTemplateFn: uf.keyboard,
    destSpec: "osc1",
    position: { x: 100, y: 400 },
  },
  {
    unitId: "keyboard2",
    unitTemplateFn: uf.keyboard,
    destSpec: "osc2",
    position: { x: 400, y: 400 },
  },
  {
    unitId: "keyboard3",
    unitTemplateFn: uf.keyboard,
    destSpec: "cvGateOsc1",
    position: { x: 700, y: 400 },
  },
  {
    unitId: "stateSwitcher1",
    unitTemplateFn: uf.stateSwitcher,
    destSpec: "osc2",
    position: { x: 1000, y: 400 },
  },
  {
    unitId: "twoPortsKeyboard1",
    unitTemplateFn: uf.twoPortsKeyboard,
    destSpec: ["osc1", "osc2"],
    position: { x: 100, y: 600 },
  },
  {
    unitId: "paramController1",
    unitTemplateFn: uf.parametersController,
    destSpec: "osc2",
    position: { x: 400, y: 600 },
  },
  {
    unitId: "cvGateStepSequencer1",
    unitTemplateFn: uf.cvGateStepSequencer,
    destSpec: "cvGateOsc1",
    position: { x: 700, y: 600 },
  },
  {
    unitId: "masterClock1",
    unitTemplateFn: uf.masterClock,
    destSpec: "clockDivider1",
    position: { x: 100, y: 800 },
  },
  {
    unitId: "keyboard4",
    unitTemplateFn: uf.keyboard,
    destSpec: ["osc1", "osc2"],
    position: { x: 400, y: 800 },
  },
  {
    unitId: "clockDivider1",
    unitTemplateFn: uf.clockDivider,
    destSpec: "cvGateStepSequencer1",
    position: { x: 700, y: 800 },
  },
];

const store = createStore<{ unitItems: UnitItem[] }>({
  unitItems: unitItemsDefault,
});

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

const WireLayer = ({ unitItems }: { unitItems: UnitItem[] }) => {
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

const App = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh flex-h">
      <div className="w-[200px] bd-red"></div>
      <div className="grow relative h-dvh bd-red isolate">
        <WireLayer unitItems={unitItems} />
        {unitItems.map((item) => (
          <div
            key={item.unitId}
            className="absolute z-10"
            style={{ left: item.position.x, top: item.position.y }}
          >
            <UnitBox
              unitId={item.unitId}
              unitTemplateFn={item.unitTemplateFn}
              pageUrl={item.pageUrl}
              destSpec={item.destSpec}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

mountAppRoot(<App />);
