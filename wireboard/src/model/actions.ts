import { dequal } from "dequal";
import { Point } from "mofur/ax-ui";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { CatalogKey } from "@/base/showcase-entries";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { Scene, UnitItem } from "@/model/types";
import { getNextUnitId } from "@/model/unit-id-helper";

type Vector = { x: number; y: number };

export const actionsInternal = {
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
  patchPortPositions(unitId: string, delta: Vector) {
    store.producePortItems((draft) => {
      for (const key in draft) {
        const port = draft[key];
        if (port.unitId === unitId) {
          port.position.x += delta.x;
          port.position.y += delta.y;
        }
      }
    });
  },
};

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    const unit = store.state.unitItems.find((item) => item.unitId === unitId);
    if (!unit) return;
    const prevPosition = unit.position;
    const delta = {
      x: position.x - prevPosition.x,
      y: position.y - prevPosition.y,
    };
    actionsInternal.patchUnitItem(unitId, { position });
    actionsInternal.patchPortPositions(unitId, delta);
  },
  addUnit(
    catalogKey: CatalogKey,
    position: Point,
    templateFn?: ReactUnitTemplateFn,
  ) {
    const unitId = getNextUnitId(catalogKey, store.state.unitItems);
    store.setUnitItems((prev) => [
      ...prev,
      {
        unitId,
        catalogKey,
        templateFn,
        position,
      },
    ]);
  },
  removeUnit(unitId: string) {
    store.setUnitItems((prev) => prev.filter((item) => item.unitId !== unitId));
    store.producePortItems((draft) => {
      for (const key in draft) {
        const port = draft[key];
        if (port.unitId === unitId) {
          delete draft[key];
        }
      }
    });
    store.setWireItems((prev) =>
      prev.filter(
        (wire) =>
          wire.sourceUnitId !== unitId && wire.destinationUnitId !== unitId,
      ),
    );
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
