import { Point } from "beams/ax-ui/common-types";
import { createStore } from "snap-store";
import { hostSystem } from "@/framework/host/host-system/host-system-2";
import {
  decodePortKey,
  mapDestSpecToPortKeys,
  mapPortKeyToDestSpec,
} from "@/host-app/common";
import { destinationCodeOp } from "@/host-app/destination-code-op";
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

export const readers = {
  findUnit(unitId: string): UnitItem | undefined {
    return store.state.unitItems.find((u) => u.unitId === unitId);
  },
  checkUnitHasDestination(unitId: string): boolean {
    const unit = store.state.unitItems.find((u) => u.unitId === unitId);
    return !!unit?.destSpec;
  },
  getUnitDestinationPortKeys(sourcePortKey: string): string[] | undefined {
    const { unitId, portIndex } = decodePortKey(sourcePortKey);
    const unit = store.state.unitItems.find((u) => u.unitId === unitId);
    if (unit?.destSpec) {
      if (portIndex !== undefined) {
        const portCode = unit.destSpec.split("|")[portIndex];
        if (!portCode) {
          return undefined;
        }
        return mapDestSpecToPortKeys(portCode);
      }
      return mapDestSpecToPortKeys(unit.destSpec);
    }
  },
};

const actionsInternal = {
  patchUnitItem(unitId: string, attrs: Partial<UnitItem>) {
    store.produceUnitItems((draft) => {
      const item = draft.find((item) => item.unitId === unitId);
      if (item) {
        Object.assign(item, attrs);
      }
    });
  },
};

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    actionsInternal.patchUnitItem(unitId, { position });
  },
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
  setTappingPortKey(portKey: string | null) {
    store.setState({ tappingPortKey: portKey });
  },
  updateConnection(sourcePortKey: string, targetPortKey: string) {
    const { unitId: sourceUnitId, portIndex: sourcePortIndex } =
      decodePortKey(sourcePortKey);
    const sourceUnit = readers.findUnit(sourceUnitId);
    if (!sourceUnit) return;

    const destSpec = mapPortKeyToDestSpec(targetPortKey);
    if (!destSpec) return;

    const currentPortsCode = sourceUnit.destSpec;
    const portCode = destSpec;

    const isIncluded = destinationCodeOp.isIncluded(currentPortsCode, destSpec);

    const nextPortsCode = !isIncluded
      ? destinationCodeOp.add(
          currentPortsCode,
          portCode,
          sourcePortIndex ? { sourcePortIndex } : undefined,
        )
      : destinationCodeOp.remove(
          currentPortsCode,
          portCode,
          sourcePortIndex ? { sourcePortIndex } : undefined,
        );
    actionsInternal.patchUnitItem(sourceUnitId, { destSpec: nextPortsCode });
  },
  clearConnection(sourcePortKey: string) {
    const { unitId: sourceUnitId } = decodePortKey(sourcePortKey);
    const sourceUnit = readers.findUnit(sourceUnitId);
    if (!sourceUnit) return;
    if (sourceUnit.destSpec) {
      actionsInternal.patchUnitItem(sourceUnitId, { destSpec: undefined });
    }
  },
  replaceToSingleConnection(sourcePortKey: string, targetPortKey: string) {
    const { unitId } = decodePortKey(sourcePortKey);
    const unitItem = readers.findUnit(unitId);
    const destSpec = mapPortKeyToDestSpec(targetPortKey);
    if (unitItem && destSpec) {
      actionsInternal.patchUnitItem(unitId, { destSpec });
    }
  },
};
