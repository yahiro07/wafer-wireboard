import { actions } from "@/central/actions";
import { UnitItem } from "@/central/store";
import { findNearestConnectionTargetUnit } from "@/central/unit-coordinate-helper";
import { unitDestSpecOp } from "./unit-dest-spec-op";

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

export function connectionLogic_toggleMultiConnectionToNearest(unit: UnitItem) {
  const nearestUnit = findNearestConnectionTargetUnit(unit.unitId);
  if (!nearestUnit) return;
  const destSpec = unit.destUnitId;
  const newDestSpec = unitDestSpecOp.toggle(destSpec ?? "", nearestUnit.unitId);
  actions.connectUnitTo(unit.unitId, newDestSpec);
}
