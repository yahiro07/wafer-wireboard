import { getUnitCardDimensions } from "@/base/slot-card-dimensions";
import { UnitItem } from "@/model/types";

function _findNearestConnectionTargetUnit_notInUse(
  unitItems: UnitItem[],
  sourceUnitId: string,
) {
  const unit = unitItems.find((item) => item.unitId === sourceUnitId);
  if (!unit) return;
  const sourceHalfHeight = getUnitCardDimensions(sourceUnitId).height / 2;

  const targetUnits = unitItems.filter((item) => {
    const destHalfHeight = getUnitCardDimensions(item.unitId).height / 2;
    return (
      item.unitId !== sourceUnitId &&
      item.position.y + destHalfHeight < unit.position.y - sourceHalfHeight
    );
  });
  const measured = targetUnits.map((item) => ({
    unitId: item.unitId,
    distance: Math.hypot(
      item.position.x - unit.position.x,
      item.position.y - unit.position.y,
    ),
  }));
  const sorted = measured.sort((a, b) => a.distance - b.distance);
  const nearestUnit = sorted[0];
  return nearestUnit;
}
