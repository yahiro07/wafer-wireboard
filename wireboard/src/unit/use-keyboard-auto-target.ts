import { useEffect } from "react";
import { store } from "@/model/store";
import { connectionActions } from "@/port/connection-actions";
import { findNearestConnectionTargetUnit } from "@/port/unit-coordinate-helper";
import { primaryDest } from "@/port/unit-dest-spec-op";

export function useKeyboardAutoTarget() {
  const { unitItems } = store.useSnapshot();
  const keyboardUnit = unitItems.find(
    (item) => item.unitId === "builtInKeyboard",
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: execute only when position changes
  useEffect(() => {
    if (keyboardUnit?.destSpec) {
      const nearestTargetUnit = findNearestConnectionTargetUnit(
        unitItems,
        keyboardUnit.unitId,
      );
      if (
        nearestTargetUnit &&
        nearestTargetUnit?.unitId !== keyboardUnit.destSpec.$primary[0]
      ) {
        connectionActions.replaceUnitDestSpec(
          keyboardUnit.unitId,
          primaryDest(nearestTargetUnit.unitId),
        );
      }
    }
  }, [keyboardUnit?.position]);
}
