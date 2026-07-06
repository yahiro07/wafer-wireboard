import { CatalogKey } from "@/base/showcase-entries";
import { UnitItem, WireItem } from "@/model/types";

export function getNextUnitId(
  catalogKey: CatalogKey,
  existingItems: UnitItem[],
) {
  const existingUnitNumbers = existingItems
    .map((item) => {
      const match = item.unitId.match(new RegExp(`^${catalogKey}_(\\d+)$`));
      if (!match) return NaN;
      return parseInt(match[1], 10);
    })
    .filter(Number.isFinite);
  const maxNumber = Math.max(...[0, ...existingUnitNumbers]);
  return `${catalogKey}_${maxNumber + 1}`;
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
