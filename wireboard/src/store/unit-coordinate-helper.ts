import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { store } from "@/store/store";

export function findNearestConnectionTargetUnit(sourceUnitId: string) {
  const { unitItems } = store.state;
  const unit = unitItems.find((item) => item.unitId === sourceUnitId);
  if (!unit) return;
  const commonUnitHalfHeight = slotCardDimensions.height / 2;
  const destHalfHeight = commonUnitHalfHeight;
  const sourceHalfHeight =
    sourceUnitId === "builtInKeyboard" ? 60 : commonUnitHalfHeight;

  const targetUnits = unitItems.filter(
    (item) =>
      item.unitId !== sourceUnitId &&
      item.position.y + destHalfHeight < unit.position.y - sourceHalfHeight,
  );
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
