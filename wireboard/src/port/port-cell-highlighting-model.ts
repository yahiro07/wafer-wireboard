import { store } from "@/model/store";
import { checkSubtypeOverlap } from "@/port/connection-logic";

export type PortCellHighlightingState =
  | "normal"
  | "truthy"
  | "truthyOutlined"
  | "falsy"
  | "falsyOutlined";

export function usePortCellHighlightingModel(
  portKey: string,
): PortCellHighlightingState {
  const { portItems, draggingPortKey, previewDestPortKey, tappingPortKey } =
    store.useSnapshot();

  if (portKey === tappingPortKey) {
    return "truthy";
  }

  if (!draggingPortKey) return "normal";

  const draggingPort = portItems[draggingPortKey];
  const selfPort = portItems[portKey];
  if (!draggingPort || !selfPort) return "normal";

  if (portKey === draggingPortKey) {
    return "truthy";
  }

  if (portKey === previewDestPortKey) {
    return "truthy";
  }

  if (
    draggingPort.direction !== selfPort.direction &&
    draggingPort.unitId !== selfPort.unitId &&
    checkSubtypeOverlap(draggingPort.subtypes, selfPort.subtypes)
  ) {
    return "truthyOutlined";
  }

  return "normal";
}
