import { CatalogKey } from "@/base/showcase-entries";
import { UnitItem } from "@/model/types";

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
