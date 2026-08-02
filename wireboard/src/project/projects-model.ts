import { iife } from "mofur/ax";
import { appConfig } from "@/main-definitions/app-config";
import { actions } from "@/model/actions";
import { hostSystem } from "@/model/host-system-instance";
import { StoreState, store } from "@/model/store";
import { createPersistenceModel } from "@/project/persistence-model";
import { createPresetProjectsModel } from "@/project/preset-projects";
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
  loadDefaultProject(): void;
  loadBlankProject(): void;
  loadDemoProject(): void;
  emitSharedUrl(): string;
};

export function createProjectsModel(): ProjectsModel {
  const presetProjectsModel = createPresetProjectsModel();
  const persistenceModel = createPersistenceModel();
  let autosaveEnabled = false;

  const internal = {
    loadProjectStates(states: Partial<StoreState>): void {
      store.assign(states);
      store.setProjectLoadedIndex((prev) => prev + 1);
      actions.reservePushCurrentSceneStateToHost(true);
      void iife(async () => {
        store.setUnitsLoading(true);
        await hostSystem.waitUnitsLoaded();
        store.setUnitsLoading(false);
      });
    },
  };
  return {
    prepareProject(load: boolean): void {
      const storeAttrs: Partial<StoreState> = {};
      if (load) {
        const initialStates =
          persistenceModel.loadPersistedState() ??
          presetProjectsModel.buildDefaultProjectStates();
        Object.assign(storeAttrs, initialStates);
      } else {
        const states = presetProjectsModel.buildDefaultProjectStates();
        Object.assign(storeAttrs, states);
      }
      const urlProjectData = sharedUrlSupport.loadUrlDataIfExists();
      if (urlProjectData) {
        Object.assign(storeAttrs, urlProjectData);
      }
      internal.loadProjectStates(storeAttrs);
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
      link.href = `data:application/json;charset=utf-8,${encodeURIComponent(text)}`;
      const fileName = appConfig.isDevelopment
        ? "_project.json"
        : "project.json";
      link.download = fileName;
      link.click();
    },
    importProject() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,application/json";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          const projectData = JSON.parse(text) as ProjectData;
          if (projectData.format === projectFormatKey) {
            internal.loadProjectStates(projectData.states);
          } else {
            alert("incompatible project format");
          }
        }
      };
      input.click();
    },
    loadDefaultProject() {
      const states = presetProjectsModel.buildDefaultProjectStates();
      internal.loadProjectStates(states);
    },
    loadBlankProject() {
      const states = presetProjectsModel.buildBlankProjectStates();
      internal.loadProjectStates(states);
    },
    loadDemoProject() {
      const states = presetProjectsModel.buildDemoProjectStates();
      internal.loadProjectStates(states);
    },
    emitSharedUrl() {
      return sharedUrlSupport.generateSharedUrl(store.state);
    },
  };
}

export const projectsModel = createProjectsModel();
