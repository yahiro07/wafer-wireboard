import { Point } from "beams/ax-ui/common-types";
import { CatalogKey } from "@/base/showcase-entries";
import { store } from "@/store/store";

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    store.setUnitItems(
      store.state.unitItems.map((item) =>
        item.unitId === unitId ? { ...item, position } : item,
      ),
    );
  },
  addUnit(catalogKey: CatalogKey, position: Point) {
    store.setUnitItems([
      ...store.state.unitItems,
      {
        unitId: `unit${store.state.unitItems.length + 1}`,
        catalogKey,
        position,
      },
    ]);
  },
};
