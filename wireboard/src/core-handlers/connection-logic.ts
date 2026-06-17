import { actions } from "@/central/actions";
import { UnitItem } from "@/central/store";
import { findNearestConnectionTargetUnit } from "@/central/unit-coordinate-helper";

export function connectionLogic_toggleSingleConnectionToNearest(
  unit: UnitItem,
) {
  if (unit.destUnitId) {
    actions.removeConnection(unit.unitId);
  } else {
    const nearestUnit = findNearestConnectionTargetUnit(unit.unitId);
    if (nearestUnit) {
      actions.connectUnitTo(unit.unitId, nearestUnit.unitId);
    }
  }
}
