import { Point } from "beams/ax-ui/common-types";
import { CatalogKey } from "@/base/showcase-entries";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { store, UnitItem } from "@/store/store";

const actionsInternal = {
  patchUnitItem(unitId: string, attrs: Partial<UnitItem>) {
    store.setUnitItems((prev) =>
      prev.map((item) =>
        item.unitId === unitId ? { ...item, ...attrs } : item,
      ),
    );
  },
};

function getNextUnitId(existingItems: UnitItem[]) {
  const existingUnitNumbers = existingItems
    .map((item) => {
      const match = item.unitId.match(/^unit(\d+)$/);
      if (!match) return NaN;
      return parseInt(match[1], 10);
    })
    .filter(Number.isFinite);
  const maxNumber = Math.max(...existingUnitNumbers);
  console.log(existingUnitNumbers, maxNumber);
  return `unit${maxNumber + 1}`;
}

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    actionsInternal.patchUnitItem(unitId, { position });
  },
  addUnit(catalogKey: CatalogKey, position: Point) {
    store.setUnitItems((prev) => [
      ...prev,
      {
        unitId: getNextUnitId(prev),
        catalogKey,
        position,
      },
    ]);
  },
  removeConnection(unitId: string) {
    actionsInternal.patchUnitItem(unitId, { destUnitId: undefined });
  },
  connectToNearestUnit(unitId: string) {
    const { unitItems } = store.state;
    const unit = unitItems.find((item) => item.unitId === unitId);
    if (!unit) return;
    const hh = slotCardDimensions.height / 2;

    const targetUnits = unitItems.filter(
      (item) =>
        item.unitId !== unitId && item.position.y + hh < unit.position.y - hh,
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
    actionsInternal.patchUnitItem(unitId, { destUnitId: nearestUnit.unitId });
  },
  removeUnit(unitId: string) {
    actionsInternal.patchUnitItem(unitId, { destUnitId: undefined });
    const dependentUnits = store.state.unitItems.filter(
      (item) => item.destUnitId === unitId,
    );
    for (const dependentUnit of dependentUnits) {
      actionsInternal.patchUnitItem(dependentUnit.unitId, {
        destUnitId: undefined,
      });
    }
    store.setUnitItems((prev) => prev.filter((item) => item.unitId !== unitId));
  },
  midiInNoteOn(noteNumber: number) {
    if (!store.state.notes.includes(noteNumber)) {
      store.setNotes((prev) => [...prev, noteNumber]);
    }
  },
  midiInNoteOff(noteNumber: number) {
    store.setNotes((prev) => prev.filter((item) => item !== noteNumber));
  },
  togglePlayState() {
    store.setPlaying((prev) => !prev);
  },
  setBpm(bpm: number) {
    store.setBpm(bpm);
  },
  setMasterVolume(volume: number) {
    store.setMasterVolume(volume);
  },
};
