import { StoreState } from "@/model/store";
import {
  generateProjectData,
  mapPartialStoreStateFromProjectDataStates,
  ProjectData,
  projectFormatKey,
} from "./project-data";
import { productionFix } from "@/periphery/production-fix-wrapper";
import {
  compressProjectJson,
  decompressProjectText,
} from "@/project/string-compression";

export const projectDataTextSupport = {
  emitProjectDataText(storeState: StoreState): string {
    const projectData = generateProjectData(storeState);
    const text = JSON.stringify(projectData);
    return compressProjectJson(text);
  },
  parseProjectDataText(
    dataText: string,
    applyProductionFix: boolean,
  ): Partial<StoreState> | "blocked" | undefined {
    try {
      const decompressed = decompressProjectText(dataText);
      if (!decompressed) {
        console.warn(`failed to decompress project data text`);
        return undefined;
      }
      const projectData = JSON.parse(decompressed) as ProjectData;
      if (projectData.format === projectFormatKey) {
        if (applyProductionFix) {
          const res = productionFix?.hookProjectData?.(projectData);
          if (res === "blocked") {
            return "blocked";
          }
        }
        return mapPartialStoreStateFromProjectDataStates(projectData.states);
      }
    } catch (error) {
      console.warn("error parsing project data text", error);
    }
  },
};

export const sharedUrlSupport = {
  generateSharedUrl(baseUrl: string, storeState: StoreState): string {
    const projectDataText =
      projectDataTextSupport.emitProjectDataText(storeState);
    return `${baseUrl}?data=${projectDataText}`;
  },
  loadUrlDataIfExists(): Partial<StoreState> | "blocked" | undefined {
    const url = new URLSearchParams(location.search);
    const text = url.get("data");
    if (text) {
      return projectDataTextSupport.parseProjectDataText(text, true);
    }
  },
};
