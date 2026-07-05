import { actions } from "@/model/actions";
import { findNearestConnectionTargetUnit } from "@/model/helpers/unit-coordinate-helper";
import { store } from "@/model/store";
import { UnitItem } from "@/model/types";
import {
  primaryDest,
  unitDestSpecOp,
} from "../model/helpers/unit-dest-spec-op";

export function connectionLogic_toggleSingleConnectionToNearest(
  unit: UnitItem,
) {
  if (unit.destSpec) {
    actions.removeConnection(unit.unitId);
  } else {
    const { unitItems } = store.state;
    const nearestUnit = findNearestConnectionTargetUnit(unitItems, unit.unitId);
    if (nearestUnit) {
      actions.replaceUnitDestSpec(unit.unitId, primaryDest(nearestUnit.unitId));
    }
  }
}

export function connectionLogic_toggleMultiConnectionToNearest(unit: UnitItem) {
  const { unitItems } = store.state;
  const nearestUnit = findNearestConnectionTargetUnit(unitItems, unit.unitId);
  if (!nearestUnit) return;
  const destSpec = unit.destSpec;
  const newDestSpec = unitDestSpecOp.toggle(destSpec, nearestUnit.unitId);
  actions.replaceUnitDestSpec(unit.unitId, newDestSpec);
}
