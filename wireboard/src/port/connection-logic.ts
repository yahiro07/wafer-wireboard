import { store } from "@/model/store";
import { PortSubtype } from "@/model/types";

export function getUnitIdFromPortKey(portKey: string): string {
  return portKey.split(".")[0];
}

export function checkSubtypeOverlap(
  subtypes1: PortSubtype[],
  subtypes2: PortSubtype[],
): boolean {
  return subtypes1.some((st) => subtypes2.includes(st));
}

// const internalActions = {
//   removeConnectionsFromUnit(unitId: string) {},
// };

export const connectionLogic = {
  // toggleSingleConnectionToNearest(unit: UnitItem) {
  //   const portKey = `${unit.unitId}.primaryOutput`;
  //   const hasConnection = Object.values(store.state.portItems).some((port) => port.portKey === portKey);
  //   if(hasConnection) {
  //     internalActions.removeConnectionsFromUnit(unit.unitId);
  //   } else {
  //     const { unitItems } = store.state;
  //     const nearestUnit = findNearestConnectionTargetUnit(
  //       unitItems,
  //       unit.unitId,
  //     );
  //     if (nearestUnit) {
  //       connectionActions.replaceUnitDestSpec(
  //         unit.unitId,
  //         primaryDest(nearestUnit.unitId),
  //       );
  //     }
  //   }

  // if (unit.destSpec) {
  //   connectionActions.removeConnection(unit.unitId);
  // } else {
  //   const { unitItems } = store.state;
  //   const nearestUnit = findNearestConnectionTargetUnit(
  //     unitItems,
  //     unit.unitId,
  //   );
  //   if (nearestUnit) {
  //     connectionActions.replaceUnitDestSpec(
  //       unit.unitId,
  //       primaryDest(nearestUnit.unitId),
  //     );
  //   }
  // }
  // },
  // toggleMultiConnectionToNearest(unit: UnitItem) {
  //   const { unitItems } = store.state;
  //   const nearestUnit = findNearestConnectionTargetUnit(unitItems, unit.unitId);
  //   if (!nearestUnit) return;
  //   const destSpec = unit.destSpec;
  //   const newDestSpec = unitDestSpecOp.toggle(destSpec, nearestUnit.unitId);
  //   connectionActions.replaceUnitDestSpec(unit.unitId, newDestSpec);
  // },
  updateConnectionSingle(sourcePortKey: string, destinationPortKey: string) {
    const connectionKey = `${sourcePortKey}-${destinationPortKey}`;
    const existingWireItem = store.state.wireItems.find(
      (wire) => wire.sourcePortKey === sourcePortKey,
    );
    if (existingWireItem) {
      store.setWireItems((prev) =>
        prev.filter((wire) => wire.sourcePortKey !== sourcePortKey),
      );
    } else {
      const wireItem = { connectionKey, sourcePortKey, destinationPortKey };
      store.setWireItems((prev) => [...prev, wireItem]);
    }
  },
  updateConnection(sourcePortKey: string, destinationPortKey: string) {
    // console.log("updateConnection", sourcePortKey, destinationPortKey);
    const connectionKey = `${sourcePortKey}-${destinationPortKey}`;
    const existingWireItem = store.state.wireItems.find(
      (wire) => wire.connectionKey === connectionKey,
    );
    if (existingWireItem) {
      store.setWireItems((prev) =>
        prev.filter((wire) => wire.connectionKey !== connectionKey),
      );
    } else {
      const wireItem = { connectionKey, sourcePortKey, destinationPortKey };
      store.setWireItems((prev) => [...prev, wireItem]);
    }

    // const { unitId: sourceUnitId, portIndex: sourcePortIndex } =
    //   decodePortKey(sourcePortKey);
    // const sourceUnit = readers.findUnit(sourceUnitId);
    // if (!sourceUnit) return;
    // const destSpec = mapPortKeyToDestSpec(targetPortKey);
    // if (!destSpec) return;
    // const currentPortsCode = sourceUnit.destSpec;
    // const portCode = destSpec;
    // const isIncluded = destinationCodeOp.isIncludedAt(
    //   currentPortsCode,
    //   destSpec,
    //   sourcePortIndex,
    // );
    // const nextPortsCode = !isIncluded
    //   ? destinationCodeOp.add(
    //       currentPortsCode,
    //       portCode,
    //       sourcePortIndex !== undefined ? { sourcePortIndex } : undefined,
    //     )
    //   : destinationCodeOp.remove(
    //       currentPortsCode,
    //       portCode,
    //       sourcePortIndex !== undefined ? { sourcePortIndex } : undefined,
    //     );
    // actionsInternal.patchUnitItem(sourceUnitId, { destSpec: nextPortsCode });
  },
  clearConnection(sourcePortKey: string) {
    console.log("clearConnection", sourcePortKey);
    store.setWireItems((prev) =>
      prev.filter((wire) => wire.sourcePortKey !== sourcePortKey),
    );
    // const { unitId: sourceUnitId } = decodePortKey(sourcePortKey);
    // const sourceUnit = readers.findUnit(sourceUnitId);
    // if (!sourceUnit) return;
    // if (sourceUnit.destSpec) {
    //   actionsInternal.patchUnitItem(sourceUnitId, { destSpec: undefined });
    // }
  },
  replaceToSingleConnection(sourcePortKey: string, targetPortKey: string) {
    console.log("replaceToSingleConnection", sourcePortKey, targetPortKey);
    // const { unitId } = decodePortKey(sourcePortKey);
    // const unitItem = readers.findUnit(unitId);
    // const destSpec = mapPortKeyToDestSpec(targetPortKey);
    // if (unitItem && destSpec) {
    //   actionsInternal.patchUnitItem(unitId, { destSpec });
    // }
  },
};
