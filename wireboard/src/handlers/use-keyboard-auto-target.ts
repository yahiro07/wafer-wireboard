import { useEffect } from "react";
import { actions } from "@/central/actions";
import { store } from "@/central/store";
import { findNearestConnectionTargetUnit } from "@/central/unit-coordinate-helper";

export function useKeyboardAutoTarget() {
  const { unitItems } = store.useSnapshot();
  const keyboardUnit = unitItems.find(
    (item) => item.unitId === "builtInKeyboard",
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: execute only when position changes
  useEffect(() => {
    if (keyboardUnit?.destUnitId) {
      const nearestTargetUnit = findNearestConnectionTargetUnit(
        keyboardUnit.unitId,
      );
      if (
        nearestTargetUnit &&
        nearestTargetUnit?.unitId !== keyboardUnit.destUnitId
      ) {
        actions.connectUnitTo(keyboardUnit.unitId, nearestTargetUnit.unitId);
      }
    }
  }, [keyboardUnit?.position]);
}
