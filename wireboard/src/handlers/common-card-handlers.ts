import { startDragSession } from "mofur/ax-ui";
import { appConfigs } from "@/base/constants";
import { actions } from "@/central/actions";
import { snapUnitCoordToGrid } from "@/central/snapping";
import { store, UnitItem } from "@/central/store";

export const handleGripPointerDown = (
  e0: React.PointerEvent,
  unit: UnitItem,
) => {
  const originalPosition = { ...unit.position };
  startDragSession(
    e0.nativeEvent,
    {
      onMove(e) {
        const delta = {
          x: e.position.x - e.originalPosition.x,
          y: e.position.y - e.originalPosition.y,
        };
        const sc = store.state.sight.eyeScaling;
        let newPosition = {
          x: originalPosition.x + delta.x / sc,
          y: originalPosition.y + delta.y / sc,
        };
        if (appConfigs.snapUnitCoordToGrid) {
          newPosition = snapUnitCoordToGrid(newPosition);
        }
        actions.setUnitPosition(unit.unitId, newPosition);
      },
    },
    { coordinate: "screen" },
  );
};
