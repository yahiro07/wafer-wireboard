import { store } from "@/model/store";

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
    draggingPort.subtype === selfPort.subtype
  ) {
    return "truthyOutlined";
  }

  return "normal";
}
