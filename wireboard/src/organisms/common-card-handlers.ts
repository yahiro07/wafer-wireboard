import { startDragSession } from "beams/ax-ui/drag-session";
import { actions } from "@/store/actions";
import { getZoomScaling } from "@/store/helper";
import { store, UnitItem } from "@/store/store";

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
        const sc = getZoomScaling(store.state.sight.zoom);
        const newPosition = {
          x: originalPosition.x + delta.x / sc,
          y: originalPosition.y + delta.y / sc,
        };
        actions.setUnitPosition(unit.unitId, newPosition);
      },
    },
    { coordinate: "screen" },
  );
};
