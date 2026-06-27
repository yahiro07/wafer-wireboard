import { useEffect } from "react";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import { findNearestConnectionTargetUnit } from "@/presenter/unit-coordinate-helper";

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
