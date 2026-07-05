import { WireItem } from "@/model/types";

export function getUnitIdFromPortKey(portKey: string): string {
  return portKey.split(".")[0];
}

export function createWireItem(
  sourcePortKey: string,
  destinationPortKey: string,
): WireItem {
  return {
    connectionKey: `${sourcePortKey}-${destinationPortKey}`,
    sourcePortKey,
    destinationPortKey,
    sourceUnitId: getUnitIdFromPortKey(sourcePortKey),
    destinationUnitId: getUnitIdFromPortKey(destinationPortKey),
  };
}
