import { Point } from "beams/ax-ui/common-types";
import { CatalogKey } from "@/base/showcase-entries";
import { store, UnitItem } from "@/store/store";

const actionsInternal = {
  patchUnitItem(unitId: string, attrs: Partial<UnitItem>) {
    store.setUnitItems(
      store.state.unitItems.map((item) =>
        item.unitId === unitId ? { ...item, ...attrs } : item,
      ),
    );
  },
};

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    actionsInternal.patchUnitItem(unitId, { position });
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
  removeConnection(unitId: string) {
    actionsInternal.patchUnitItem(unitId, { destUnitId: undefined });
  },
};
