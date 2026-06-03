import { Point } from "beams/ax-ui/common-types";
import { createStore } from "snap-store";
import { hostSystem } from "@/framework/host/host-system/host-system-2";
import { UnitDestinationSpec } from "@/framework/host/host-types";
import { decodePortKey, mapPortKeyToDestSpec } from "@/host-app/common";
import { PortItem, UnitItem } from "@/host-app/types";
import { reactUnitFactories } from "@/units/react";

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
    destSpec: ["osc1", "osc2"],
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
}>({
  loading: false,
  unitItems: unitItemsDefault,
  portItems: {},
  draggingPortKey: null,
  previewDestPortKey: null,
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

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    store.produceUnitItems((draft) => {
      const item = draft.find((item) => item.unitId === unitId);
      if (item) {
        item.position = position;
      }
    });
  },
  // patchPortItem(portKey: string, attrs: Partial<PortItem>) {
  //   store.setPortItems((prev) => ({
  //     ...prev,
  //     [portKey]: { ...prev[portKey], ...attrs },
  //   }));
  // },
  addPortItem(portKey: string, portItem: PortItem) {
    store.setPortItems((prev) => ({
      ...prev,
      [portKey]: portItem,
    }));
  },
  removePortItem(portKey: string) {
    store.setPortItems((prev) => {
      const newPortItems = { ...prev };
      delete newPortItems[portKey];
      return newPortItems;
    });
  },
  setDraggingPortKey(portKey: string | null) {
    store.setDraggingPortKey(portKey);
  },
  setPreviewDestPortKey(portKey: string | null) {
    store.setPreviewDestPortKey(portKey);
  },
  updateConnection(sourcePortKey: string, targetPortKey: string) {
    const { unitId: sourceUnitId } = decodePortKey(sourcePortKey);
    const sourceUnit = store.state.unitItems.find(
      (u) => u.unitId === sourceUnitId,
    );
    if (!sourceUnit) return;

    const destSpec = mapPortKeyToDestSpec(targetPortKey);
    if (!destSpec) return;

    const currentDestSpec = sourceUnit.destSpec;
    let shouldUpdate = false;
    let nextDestSpec: UnitDestinationSpec | undefined;
    if (currentDestSpec === undefined) {
      //new connection
      nextDestSpec = destSpec;
      shouldUpdate = true;
    } else if (currentDestSpec === destSpec) {
      //disconnect
      nextDestSpec = undefined;
      shouldUpdate = true;
    } else if (Array.isArray(currentDestSpec)) {
      if (!currentDestSpec.includes(destSpec)) {
        nextDestSpec = [...currentDestSpec, destSpec];
      } else {
        nextDestSpec = currentDestSpec.filter((spec) => spec !== destSpec);
      }
      shouldUpdate = true;
    } else if (currentDestSpec.includes("&")) {
      const parts = currentDestSpec.split("&").map((s) => s.trim());
      if (!parts.includes(destSpec)) {
        nextDestSpec = [...parts, destSpec].join("&");
      } else {
        nextDestSpec = parts.filter((spec) => spec !== destSpec).join("&");
      }
      shouldUpdate = true;
    } else if (typeof currentDestSpec === "string") {
      nextDestSpec = [currentDestSpec, destSpec].join("&");
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      store.produceUnitItems((draft) => {
        const item = draft.find((item) => item.unitId === sourceUnitId);
        if (item) {
          item.destSpec = nextDestSpec;
        }
      });
    }
  },
};
