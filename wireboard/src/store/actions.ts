import { Point } from "mofur/ax-ui";
import { CatalogKey } from "@/base/showcase-entries";
import { hostSystem } from "@/store/host-system-instance";
import { store, UnitItem } from "@/store/store";
import { findNearestConnectionTargetUnit } from "@/store/unit-coordinate-helper";
import { getNextUnitId } from "@/store/unit-id-helper";

const actionsInternal = {
  patchUnitItem(unitId: string, attrs: Partial<UnitItem>) {
    store.setUnitItems((prev) =>
      prev.map((item) =>
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
    store.setUnitItems((prev) => [
      ...prev,
      {
        unitId: getNextUnitId(prev),
        catalogKey,
        position,
      },
    ]);
  },
  connectUnitTo(unitId: string, destUnitId: string) {
    actionsInternal.patchUnitItem(unitId, { destUnitId });
  },
  removeConnection(unitId: string) {
    actionsInternal.patchUnitItem(unitId, { destUnitId: undefined });
  },
  connectToNearestUnit(unitId: string) {
    const nearestUnit = findNearestConnectionTargetUnit(unitId);
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
  setDraggingCoverVisible(visible: boolean) {
    store.setDraggingCoverVisible(visible);
  },
  selectScene(sceneId: string) {
    if (sceneId === store.state.currentSceneId) return;
    {
      //preserve current scene
      const unitStates = hostSystem.exportUnitStates();
      // console.log(`preserve scene ${store.state.currentSceneId}:`, unitStates);
      store.setScenes((prev) =>
        prev.map((scene) =>
          scene.sceneId === store.state.currentSceneId
            ? { ...scene, unitStates }
            : scene,
        ),
      );
    }
    store.setCurrentSceneId(sceneId);
    {
      //load next scene
      const nextScene = store.state.scenes.find(
        (scene) => scene.sceneId === sceneId,
      );
      if (nextScene) {
        // console.log(`load scene ${sceneId}:`, nextScene.unitStates);
        hostSystem.reserveImportUnitStates(nextScene.unitStates);
      }
    }
  },
};
