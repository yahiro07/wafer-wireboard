import { findNearestConnectionTargetUnit } from "@/model/helpers/unit-coordinate-helper";
import { primaryDest, unitDestSpecOp } from "@/model/helpers/unit-dest-spec-op";
import { store } from "@/model/store";
import { UnitItem } from "@/model/types";
import { connectionActions } from "@/port/connection-actions";

export const connectionLogic = {
  toggleSingleConnectionToNearest(unit: UnitItem) {
    if (unit.destSpec) {
      connectionActions.removeConnection(unit.unitId);
    } else {
      const { unitItems } = store.state;
      const nearestUnit = findNearestConnectionTargetUnit(
        unitItems,
        unit.unitId,
      );
      if (nearestUnit) {
        connectionActions.replaceUnitDestSpec(
          unit.unitId,
          primaryDest(nearestUnit.unitId),
        );
      }
    }
  },
  toggleMultiConnectionToNearest(unit: UnitItem) {
    const { unitItems } = store.state;
    const nearestUnit = findNearestConnectionTargetUnit(unitItems, unit.unitId);
    if (!nearestUnit) return;
    const destSpec = unit.destSpec;
    const newDestSpec = unitDestSpecOp.toggle(destSpec, nearestUnit.unitId);
    connectionActions.replaceUnitDestSpec(unit.unitId, newDestSpec);
  },
};
