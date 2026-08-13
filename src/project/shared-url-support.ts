import LZString from "lz-string";
import { StoreState } from "@/model/store";
import {
  generateProjectData,
  ProjectData,
  projectFormatKey,
} from "./project-data";
import { productionFix } from "@/periphery/production-fix-wrapper";

export const sharedUrlSupport = {
  generateSharedUrl(baseUrl: string, storeState: StoreState): string {
    const projectData = generateProjectData(storeState);
    const text = JSON.stringify(projectData);
    const compressed = LZString.compressToEncodedURIComponent(text);
    return `${baseUrl}?data=${compressed}`;
  },
  loadUrlDataIfExists(): Partial<StoreState> | "blocked" | undefined {
    try {
      const url = new URLSearchParams(location.search);
      const text = url.get("data");
      if (text) {
        const decompressed = LZString.decompressFromEncodedURIComponent(text);
        const projectData = JSON.parse(decompressed) as ProjectData;
        if (projectData.format === projectFormatKey) {
          const res = productionFix?.hookProjectData?.(projectData);
          if (res === "blocked") {
            return "blocked";
          }
          return projectData.states;
        }
      }
    } catch (error) {
      console.warn("error parsing shared url data", error);
    }
  },
};
