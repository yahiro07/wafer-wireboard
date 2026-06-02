import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { createStore } from "snap-store";
import { UnitBox } from "@/host-app/organisms/unit-box";
import { UnitItem } from "@/host-app/types";
import { WireLayer } from "@/host-app/wire-layer";
import { reactUnitFactories } from "@/units/react";

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
