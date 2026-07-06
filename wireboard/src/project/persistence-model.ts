import { pickObjectMembers, shallowEqual } from "mofur/ax";
import { FieldSight } from "@/components/field-sight-plane";
import { actions } from "@/model/actions";
import { StoreState, store } from "@/model/store";
import { Scene, UnitItem, WireItem } from "@/model/types";

type PersistenceModel = {
  loadPersistedState(): Partial<StoreState> | undefined;
  setupAutoSave(): () => void;
};

type PersistedState = {
  unitItems: UnitItem[];
  wireItems: WireItem[];
  sight: FieldSight;
  bpm: number;
  masterVolume: number;
  scenes: Scene[];
  currentSceneId: string;
  sceneSwitcherVisible: boolean;
};

function makePersistedState(storeState: StoreState): PersistedState {
  return pickObjectMembers(storeState, {
    unitItems: 1,
    wireItems: 1,
    sight: 1,
    bpm: 1,
    masterVolume: 1,
    scenes: 1,
    currentSceneId: 1,
    sceneSwitcherVisible: 1,
  });
}

export function createPersistenceModel(): PersistenceModel {
  const storageKey = "wireboard-persist-state";

  let stateLatest: PersistedState | undefined;

  const core = {
    loadPersistedState(): PersistedState | undefined {
      const text = localStorage.getItem(storageKey);
      if (text) {
        try {
          return JSON.parse(text);
        } catch (error) {
          console.warn("error loading state from localStorage", error);
        }
      }
    },
    savePersistedState(state: PersistedState) {
      localStorage.setItem(storageKey, JSON.stringify(state));
    },
    ensureLatestSaved() {
      actions.pullCurrentSceneStateFromUnits();
      const newState = makePersistedState(store.state);
      if (!shallowEqual(stateLatest, newState)) {
        core.savePersistedState(newState);
        stateLatest = newState;
        console.log("states saved");
      }
    },
  };

  return {
    loadPersistedState() {
      return core.loadPersistedState();
    },
    setupAutoSave() {
      stateLatest = makePersistedState(store.state);

      const timerId = setInterval(core.ensureLatestSaved, 10 * 1000);

      const visibilityChangeHandler = () => {
        if (document.visibilityState !== "visible") {
          core.ensureLatestSaved();
        }
      };
      document.addEventListener("visibilitychange", visibilityChangeHandler);

      return () => {
        clearInterval(timerId);
        document.removeEventListener(
          "visibilitychange",
          visibilityChangeHandler,
        );
      };
    },
  };
}
