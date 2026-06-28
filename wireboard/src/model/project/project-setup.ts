import {
  preApplyPersistenceState,
  setupPersistence,
} from "@/model/project/persistence";
import { loadUrlDataIfExists } from "@/model/project/shared-url-support";

export function prepareProject(): () => void {
  if (1) {
    preApplyPersistenceState();
  }
  const loadedFromUrl = loadUrlDataIfExists();
  if (loadedFromUrl) {
    return () => {};
  }
  return setupPersistence; //this will be executed after first render
}
