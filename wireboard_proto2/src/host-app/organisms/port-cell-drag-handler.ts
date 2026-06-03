import { startDragSession } from "beams/ax-ui/drag-session";
import { actions } from "@/host-app/store";

export function handlePortCellDragging(
  e0: React.PointerEvent,
  portKey: string,
) {
  startDragSession(e0.nativeEvent, {
    onDown() {
      actions.setDraggingPortKey(portKey);
    },
    onUpOrCancel() {
      actions.setDraggingPortKey(null);
    },
  });
  e0.stopPropagation();
}
