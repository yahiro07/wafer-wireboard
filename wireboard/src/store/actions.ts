import { Point } from "beams/ax-ui/common-types";
import { CatalogKey } from "@/base/showcase-entries";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
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
  connectToNearestUnit(uintId: string) {
    const unit = store.state.unitItems.find((item) => item.unitId === uintId);
    if (!unit) return;
    const hh = slotCardDimensions.height / 2;
    const targetUnits = store.state.unitItems.filter(
      (item) =>
        item.unitId !== uintId && item.position.y + hh < unit.position.y - hh,
    );
    const measured = targetUnits.map((item) => ({
      unitId: item.unitId,
      distance: Math.hypot(
        item.position.x - unit.position.x,
        item.position.y - unit.position.y,
      ),
    }));
    const sorted = measured.sort((a, b) => a.distance - b.distance);
    const nearestUnit = sorted[0];
    if (!nearestUnit) return;
    actionsInternal.patchUnitItem(uintId, { destUnitId: nearestUnit.unitId });
  },
};
