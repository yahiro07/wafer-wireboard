import { Point } from "mofur/ax-ui";
import {
  decodePortKey,
  mapDestSpecToPortKeys,
  mapPortKeyToDestSpec,
} from "@/host-app/common";
import { destinationCodeOp } from "@/host-app/destination-code-op";
import { store } from "@/host-app/store";
import { PortItem, UnitItem } from "@/host-app/types";

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

    const isIncluded = destinationCodeOp.isIncludedAt(
      currentPortsCode,
      destSpec,
      sourcePortIndex,
    );

    const nextPortsCode = !isIncluded
      ? destinationCodeOp.add(
          currentPortsCode,
          portCode,
          sourcePortIndex !== undefined ? { sourcePortIndex } : undefined,
        )
      : destinationCodeOp.remove(
          currentPortsCode,
          portCode,
          sourcePortIndex !== undefined ? { sourcePortIndex } : undefined,
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
