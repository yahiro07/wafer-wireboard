import { dequal } from "dequal";
import { Point } from "mofur/ax-ui";
import { ShowcaseEntry } from "@/main-definitions/showcase-entries";
import { getNextUnitId } from "@/model/factory";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { ModalPanelKind, Scene, UnitItem } from "@/model/types";

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
};

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    actionsInternal.patchUnitItem(unitId, { position });
  },
  addUnit(showcaseEntry: ShowcaseEntry, position: Point) {
    const unitId = getNextUnitId(
      showcaseEntry.catalogKey,
      store.state.unitItems,
    );
    store.setUnitItems((prev) => [
      ...prev,
      { unitId, catalogKey: showcaseEntry.catalogKey, position },
    ]);
    return unitId;
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
  reservePushCurrentSceneStateToHost(awaited: boolean) {
    const { currentSceneId, scenes } = store.state;
    const currentScene = scenes.find(
      (scene) => scene.sceneId === currentSceneId,
    );
    if (currentScene) {
      if (awaited) {
        void (async () => {
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
  showModalPanel(kind: ModalPanelKind) {
    store.setModalPanelKind(kind);
  },
  toggleModalPanel(modalPanelKind: ModalPanelKind) {
    store.setModalPanelKind((prev) =>
      prev === modalPanelKind ? null : modalPanelKind,
    );
  },
  hideModalPanel() {
    store.setModalPanelKind(null);
  },
};
