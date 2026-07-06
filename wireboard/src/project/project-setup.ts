import {
  preApplyPersistenceState,
  setupPersistence,
} from "@/project/persistence";
import { loadUrlDataIfExists } from "@/project/shared-url-support";

export function prepareProject(load: boolean): () => void {
  if (load) {
    preApplyPersistenceState();
  }
  const loadedFromUrl = loadUrlDataIfExists();
  if (loadedFromUrl) {
    return () => {};
  }
  return setupPersistence; //this will be executed after first render
}
