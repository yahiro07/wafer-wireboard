import { useEffect } from "react";
import { findNearestConnectionTargetUnit } from "@/model/helpers/unit-coordinate-helper";
import { primaryDest } from "@/model/helpers/unit-dest-spec-op";
import { store } from "@/model/store";
import { connectionActions } from "@/port/connection-actions";

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
