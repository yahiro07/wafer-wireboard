import { UnitItem } from "@/model/types";

export function getNextUnitId(existingItems: UnitItem[]) {
  const existingUnitNumbers = existingItems
    .map((item) => {
      const match = item.unitId.match(/^unit(\d+)$/);
      if (!match) return NaN;
      return parseInt(match[1], 10);
    })
    .filter(Number.isFinite);
  const maxNumber = Math.max(...[0, ...existingUnitNumbers]);
  return `unit${maxNumber + 1}`;
}
