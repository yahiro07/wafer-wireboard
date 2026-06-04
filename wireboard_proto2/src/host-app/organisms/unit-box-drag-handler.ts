import { startDragSession } from "beams/ax-ui/drag-session";
import { actions } from "@/host-app/actions";
import { store } from "@/host-app/store";

export function handleUnitBoxDragging(e0: React.PointerEvent, unitId: string) {
  const unit = store.state.unitItems.find((u) => u.unitId === unitId);
  if (!unit) return;
  const unitStartPosition = { ...unit.position };
  startDragSession(e0.nativeEvent, {
    onMove(e) {
      const delta = {
        x: e.position.x - e.originalPosition.x,
        y: e.position.y - e.originalPosition.y,
      };
      const newPosition = {
        x: unitStartPosition.x + delta.x,
        y: unitStartPosition.y + delta.y,
      };
      actions.setUnitPosition(unitId, newPosition);
    },
  });
}
