import { actions } from "@/model/actions";
import { StoreState, store } from "@/model/store";
import { createPersistenceModel } from "@/project/persistence-model";
import { sharedUrlSupport } from "@/project/shared-url-support";

type ProjectsModel = {
  prepareProject(load: boolean): void; //called before first render
  setupLifecycle(): (() => void) | undefined; //called with useEffect in first render
};

export function createProjectsModel(): ProjectsModel {
  const persistenceModel = createPersistenceModel();
  let autosaveEnabled = false;
  return {
    prepareProject(load: boolean): void {
      const loadedStoreAttrs: Partial<StoreState> = {};
      if (load) {
        const persistedState = persistenceModel.loadPersistedState();
        if (persistedState) {
          Object.assign(loadedStoreAttrs, persistedState);
        }
      }
      const urlProjectData = sharedUrlSupport.loadUrlDataIfExists();
      if (urlProjectData) {
        Object.assign(loadedStoreAttrs, urlProjectData);
      }
      store.assign(loadedStoreAttrs);
      actions.reservePushCurrentSceneStateToHost(true);
      autosaveEnabled = !urlProjectData;
    },
    setupLifecycle() {
      if (autosaveEnabled) {
        return persistenceModel.setupAutoSave();
      }
    },
  };
}

export const projectsModel = createProjectsModel();
