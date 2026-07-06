import {
  preApplyPersistenceState,
  setupPersistence,
} from "@/model/project/persistence";
import { loadUrlDataIfExists } from "@/model/project/shared-url-support";

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
