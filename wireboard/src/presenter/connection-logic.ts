import { actions } from "@/model/actions";
import { findNearestConnectionTargetUnit } from "@/model/helpers/unit-coordinate-helper";
import { store } from "@/model/store";
import { UnitItem } from "@/model/types";
import { unitDestSpecOp } from "../model/helpers/unit-dest-spec-op";

export function connectionLogic_toggleSingleConnectionToNearest(
  unit: UnitItem,
) {
  if (unit.destUnitId) {
    actions.removeConnection(unit.unitId);
  } else {
    const { unitItems } = store.state;
    const nearestUnit = findNearestConnectionTargetUnit(unitItems, unit.unitId);
    if (nearestUnit) {
      actions.connectUnitTo(unit.unitId, nearestUnit.unitId);
    }
  }
}

export function connectionLogic_toggleMultiConnectionToNearest(unit: UnitItem) {
  const { unitItems } = store.state;
  const nearestUnit = findNearestConnectionTargetUnit(unitItems, unit.unitId);
  if (!nearestUnit) return;
  const destSpec = unit.destUnitId;
  const newDestSpec = unitDestSpecOp.toggle(destSpec ?? "", nearestUnit.unitId);
  actions.connectUnitTo(unit.unitId, newDestSpec);
}
