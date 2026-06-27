import { useEffect } from "react";
import { actions } from "@/model/actions";
import { findNearestConnectionTargetUnit } from "@/model/helpers/unit-coordinate-helper";
import { store } from "@/model/store";

export function useKeyboardAutoTarget() {
  const { unitItems } = store.useSnapshot();
  const keyboardUnit = unitItems.find(
    (item) => item.unitId === "builtInKeyboard",
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: execute only when position changes
  useEffect(() => {
    if (keyboardUnit?.destUnitId) {
      const nearestTargetUnit = findNearestConnectionTargetUnit(
        unitItems,
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
