import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { PortItem, UnitItem } from "@/host-app/types";
import { reactUnitFactories } from "@/units/react";

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);

const uf = reactUnitFactories;

const d = 70;

const unitItemsDefault: UnitItem[] = [
  {
    unitId: "mixer1",
    unitTemplateFn: uf.mixer,
    destSpec: "$output",
    position: { x: 300, y: 20 },
  },
  {
    unitId: "osc1",
    pageUrl: "/units/osc/index.html",
    destSpec: "mixer1.port0",
    position: { x: 100, y: 150 + d },
  },
  {
    unitId: "osc2",
    unitTemplateFn: uf.osc,
    destSpec: "mixer1.port1",
    position: { x: 400, y: 180 + d },
  },
  {
    unitId: "cvGateOsc1",
    unitTemplateFn: uf.cvGateOsc,
    destSpec: "mixer1.port2",
    position: { x: 700, y: 150 + d },
  },
  {
    unitId: "keyboard1",
    unitTemplateFn: uf.keyboard,
    destSpec: "osc1",
    position: { x: 50, y: 400 + d },
  },
  {
    unitId: "keyboard2",
    unitTemplateFn: uf.keyboard,
    destSpec: "osc2",
    position: { x: 300, y: 400 + d },
  },
  {
    unitId: "keyboard3",
    unitTemplateFn: uf.keyboard,
    destSpec: "cvGateOsc1",
    position: { x: 600, y: 400 + d },
  },
  {
    unitId: "stateSwitcher1",
    unitTemplateFn: uf.stateSwitcher,
    destSpec: "osc2",
    position: { x: 1000, y: 400 + d },
  },
  {
    unitId: "twoPortsKeyboard1",
    unitTemplateFn: uf.twoPortsKeyboard,
    destSpec: "osc1|osc2",
    position: { x: 100, y: 600 + d },
  },
  {
    unitId: "paramController1",
    unitTemplateFn: uf.parametersController,
    destSpec: "osc2",
    position: { x: 500, y: 600 + d },
  },
  {
    unitId: "cvGateStepSequencer1",
    unitTemplateFn: uf.cvGateStepSequencer,
    destSpec: "cvGateOsc1",
    position: { x: 800, y: 600 + d },
  },
  {
    unitId: "masterClock1",
    unitTemplateFn: uf.masterClock,
    destSpec: "clockDivider1",
    position: { x: 100, y: 800 + d },
  },
  {
    unitId: "keyboard4",
    unitTemplateFn: uf.keyboard,
    destSpec: "osc1&osc2",
    position: { x: 400, y: 800 + d },
  },
  {
    unitId: "clockDivider1",
    unitTemplateFn: uf.clockDivider,
    destSpec: "cvGateStepSequencer1",
    position: { x: 700, y: 800 + d },
  },
];

export const store = createStore<{
  loading: boolean;
  unitItems: UnitItem[];
  portItems: Record<string, PortItem>;
  draggingPortKey: string | null;
  previewDestPortKey: string | null;
  tappingPortKey: string | null;
}>({
  loading: false,
  unitItems: unitItemsDefault,
  portItems: {},
  draggingPortKey: null,
  previewDestPortKey: null,
  tappingPortKey: null,
});

hostSystem.eventPort.subscribe((ev) => {
  if (ev.type === "loadStarted") {
    console.log("Load started");
    store.setLoading(true);
  } else if (ev.type === "loadCompleted") {
    console.log("Load completed");
    store.setLoading(false);
  }
});
