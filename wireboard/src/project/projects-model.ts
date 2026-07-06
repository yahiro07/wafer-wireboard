import {
  preApplyPersistenceState,
  setupPersistence,
} from "@/project/persistence";
import { loadUrlDataIfExists } from "@/project/shared-url-support";

type ProjectsModel = {
  prepareProject(load: boolean): void; //called before first render
  setupLifecycle(): (() => void) | undefined; //called with useEffect in first render
};

export function createProjectsModel(): ProjectsModel {
  let loadedFromUrl = false;
  return {
    prepareProject(load: boolean): void {
      if (load) {
        preApplyPersistenceState();
      }
      loadedFromUrl = loadUrlDataIfExists();
    },
    setupLifecycle() {
      if (loadedFromUrl) {
        return setupPersistence();
      }
    },
  };
}

export const projectsModel = createProjectsModel();
