import { PortSubtype } from "@/contract/unit-interfaces";
import { store } from "@/host-app/store";

type HighlightingState =
  | "normal"
  | "truthy"
  | "truthyOutlined"
  | "falsy"
  | "falsyOutlined";

function checkSubtypeOverlap(
  subtypes1: PortSubtype[],
  subtypes2: PortSubtype[],
): boolean {
  return subtypes1.some((st) => subtypes2.includes(st));
}

export function usePortHighlightingModel(portKey: string): HighlightingState {
  const { draggingPortKey, portItems } = store.useSnapshot();
  if (!draggingPortKey) return "normal";

  const draggingPort = portItems[draggingPortKey];
  const selfPort = portItems[portKey];
  if (!draggingPort || !selfPort) return "normal";

  if (
    draggingPort.direction !== selfPort.direction &&
    draggingPort.unitId !== selfPort.unitId &&
    checkSubtypeOverlap(draggingPort.portSubtypes, selfPort.portSubtypes)
  ) {
    return "truthyOutlined";
  }

  return portKey === draggingPortKey ? "truthy" : "normal";
}
