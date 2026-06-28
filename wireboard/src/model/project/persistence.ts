import { pickObjectMembers, shallowEqual } from "mofur/ax";
import { FieldSight } from "@/components/field-sight-plane";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import { Scene, UnitItem } from "@/model/types";

type PersistState = {
  unitItems: UnitItem[];
  sight: FieldSight;
  bpm: number;
  masterVolume: number;
  scenes: Scene[];
  currentSceneId: string;
  sceneSwitcherVisible: boolean;
};

const storageKey = "wireboard-persist-state";

const moduleLocal: {
  stateLatest: PersistState | undefined;
} = {
  stateLatest: undefined,
};

const core = {
  loadStateFromLocalStorage() {
    const text = localStorage.getItem(storageKey);
    if (text) {
      try {
        const persistState = JSON.parse(text) as PersistState;
        store.assign(persistState);
        moduleLocal.stateLatest = persistState;
        console.log("states loaded", persistState);
      } catch (error) {
        console.warn("error loading state from localStorage", error);
      }
    }
  },
  saveStateToLocalStorageIfChanged() {
    const newState: PersistState = pickObjectMembers(store.state, {
      unitItems: 1,
      sight: 1,
      bpm: 1,
      masterVolume: 1,
      scenes: 1,
      currentSceneId: 1,
      sceneSwitcherVisible: 1,
    });
    if (!shallowEqual(moduleLocal.stateLatest, newState)) {
      localStorage.setItem(storageKey, JSON.stringify(newState));
      moduleLocal.stateLatest = newState;
      console.log("states saved");
    }
  },
};

export function preApplyPersistenceState() {
  core.loadStateFromLocalStorage();
  actions.reservePushCurrentSceneStateToHost(true);
}

export function setupPersistence() {
  function ensureLatestSaved() {
    actions.pullCurrentSceneStateFromUnits();
    core.saveStateToLocalStorageIfChanged();
  }

  const timerId = setInterval(ensureLatestSaved, 10 * 1000);

  const visibilityChangeHandler = () => {
    if (document.visibilityState !== "visible") {
      ensureLatestSaved();
    }
  };

  document.addEventListener("visibilitychange", visibilityChangeHandler);

  return () => {
    clearInterval(timerId);
    document.removeEventListener("visibilitychange", visibilityChangeHandler);
  };
}
