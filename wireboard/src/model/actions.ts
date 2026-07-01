import { dequal } from "dequal";
import { Point } from "mofur/ax-ui";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { CatalogKey } from "@/base/showcase-entries";
import { getNextUnitId } from "@/model/helpers/unit-id-helper";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { Scene, UnitItem } from "@/model/types";

const actionsInternal = {
  patchUnitItem(unitId: string, attrs: Partial<UnitItem>) {
    store.setUnitItems((prev) =>
      prev.map((item) =>
        item.unitId === unitId ? { ...item, ...attrs } : item,
      ),
    );
  },
  patchScene(sceneId: string, attrs: Partial<Scene>) {
    store.produceScenes((draft) => {
      const scene = draft.find((scene) => scene.sceneId === sceneId);
      if (scene) {
        Object.assign(scene, attrs);
      }
    });
  },
};

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    actionsInternal.patchUnitItem(unitId, { position });
  },
  addUnit(
    catalogKey: CatalogKey,
    position: Point,
    templateFn?: ReactUnitTemplateFn,
    moduleUrl?: string,
  ) {
    store.setUnitItems((prev) => [
      ...prev,
      {
        unitId: `${catalogKey}_${getNextUnitId(prev)}`,
        catalogKey,
        templateFn,
        moduleUrl,
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
  // midiInNoteOn(noteNumber: number) {
  //   if (!store.state.notes.includes(noteNumber)) {
  //     store.setNotes((prev) => [...prev, noteNumber]);
  //   }
  // },
  // midiInNoteOff(noteNumber: number) {
  //   store.setNotes((prev) => prev.filter((item) => item !== noteNumber));
  // },
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
      const unitStates = hostSystem.getAllUnitStates();
      // console.log(`preserve scene ${store.state.currentSceneId}:`, unitStates);
      actionsInternal.patchScene(store.state.currentSceneId, { unitStates });
    }
    store.setCurrentSceneId(sceneId);
    {
      //load next scene
      const nextScene = store.state.scenes.find(
        (scene) => scene.sceneId === sceneId,
      );
      if (nextScene) {
        // console.log(`load scene ${sceneId}:`, nextScene.unitStates);
        hostSystem.setAllUnitStates(nextScene.unitStates);
      }
    }
  },
  toggleSceneSwitcherVisible() {
    store.toggleSceneSwitcherVisible();
  },
  handleUnitSourceUpdate(catalogKey: CatalogKey) {
    store.produceUnitItems((draft) => {
      for (const item of draft) {
        if (item.catalogKey === catalogKey) {
          item.fileChangeRevision ??= 0;
          item.fileChangeRevision++;
        }
      }
    });
  },
  reservePushCurrentSceneStateToHost(awaited: boolean) {
    const { currentSceneId, scenes } = store.state;
    const currentScene = scenes.find(
      (scene) => scene.sceneId === currentSceneId,
    );
    if (currentScene) {
      if (awaited) {
        (async () => {
          await hostSystem.waitUnitsLoaded();
          hostSystem.setAllUnitStates(currentScene.unitStates);
        })();
      } else {
        hostSystem.setAllUnitStates(currentScene.unitStates);
      }
    }
  },
  pullCurrentSceneStateFromUnits() {
    const unitStates = hostSystem.getAllUnitStates();
    const { currentSceneId, scenes } = store.state;
    const scene = scenes.find((scene) => scene.sceneId === currentSceneId);
    if (scene && !dequal(unitStates, scene.unitStates)) {
      actionsInternal.patchScene(currentSceneId, { unitStates });
    }
  },
};
