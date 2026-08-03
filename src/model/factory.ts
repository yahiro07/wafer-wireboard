import { UnitItem, WireItem } from "@/model/types";

export function getNextUnitId(baseName: string, existingItems: UnitItem[]) {
  const existingUnitNumbers = existingItems
    .map((item) => {
      const match = item.unitId.match(new RegExp(`^${baseName}_(\\d+)$`));
      if (!match) return NaN;
      return parseInt(match[1], 10);
    })
    .filter(Number.isFinite);
  const maxNumber = Math.max(0, ...existingUnitNumbers);
  return `${baseName}_${maxNumber + 1}`;
}

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
