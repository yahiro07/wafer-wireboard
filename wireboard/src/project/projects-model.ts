import { appConfig } from "@/base/app-config";
import { actions } from "@/model/actions";
import { StoreState, store } from "@/model/store";
import { createPersistenceModel } from "@/project/persistence-model";
import {
  generateProjectData,
  ProjectData,
  projectFormatKey,
} from "@/project/project-data";
import { sharedUrlSupport } from "@/project/shared-url-support";

type ProjectsModel = {
  prepareProject(load: boolean): void; //called before first render
  setupLifecycle(): (() => void) | undefined; //called with useEffect in first render
  exportProject(): void;
  importProject(): void;
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
    exportProject() {
      const projectData = generateProjectData(store.state);
      const text = JSON.stringify(projectData, null, 2);
      const link = document.createElement("a");
      link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
      const fileName = appConfig.isDevelopment
        ? "_project.json"
        : "project.json";
      link.download = fileName;
      link.click();
    },
    importProject() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          const projectData = JSON.parse(text) as ProjectData;
          if (projectData.format === projectFormatKey) {
            store.assign(projectData.states);
            actions.reservePushCurrentSceneStateToHost(true);
          } else {
            alert("incompatible project format");
          }
        }
      };
      input.click();
    },
  };
}

export const projectsModel = createProjectsModel();
