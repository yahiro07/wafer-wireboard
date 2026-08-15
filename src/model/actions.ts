import { dequal } from "dequal";
import { Point } from "@/auxiliaries/common-types";
import { ShowcaseEntry } from "@/main-definitions/showcase-entries";
import { getNextUnitId } from "@/model/factory";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { ModalPanelKind, UnitItem } from "@/model/types";

export const actionsInternal = {
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
  setPlayState(playing: boolean) {
    store.setPlaying(playing);
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
  pushSceneStatesToUnits() {
    const { scene } = store.state;
    hostSystem.setAllUnitStates(scene.unitStates);
  },
  pullCurrentSceneStateFromUnits() {
    const unitStates = hostSystem.getAllUnitStates();
    const { scene } = store.state;
    if (scene && !dequal(unitStates, scene.unitStates)) {
      store.patchScene({ unitStates });
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
  toggleWireVertical() {
    store.toggleWireVertical();
  },
  toggleSecondControlBarVisible() {
    store.toggleSecondControlBarVisible();
  },
};
