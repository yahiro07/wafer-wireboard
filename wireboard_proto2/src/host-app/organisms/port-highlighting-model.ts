import { checkSubtypeOverlap } from "@/host-app/common";
import { store } from "@/host-app/store";

type HighlightingState =
  | "normal"
  | "truthy"
  | "truthyOutlined"
  | "falsy"
  | "falsyOutlined";

export function usePortHighlightingModel(portKey: string): HighlightingState {
  const { portItems, draggingPortKey, previewDestPortKey } =
    store.useSnapshot();
  if (!draggingPortKey) return "normal";

  const draggingPort = portItems[draggingPortKey];
  const selfPort = portItems[portKey];
  if (!draggingPort || !selfPort) return "normal";

  if (previewDestPortKey === portKey) {
    return "truthy";
  }

  if (
    draggingPort.direction !== selfPort.direction &&
    draggingPort.unitId !== selfPort.unitId &&
    checkSubtypeOverlap(draggingPort.portSubtypes, selfPort.portSubtypes)
  ) {
    return "truthyOutlined";
  }

  return portKey === draggingPortKey ? "truthy" : "normal";
}
