import LZString from "lz-string";
import { StoreState } from "@/model/store";
import {
  generateProjectData,
  ProjectData,
  projectFormatKey,
} from "./project-data";

export const sharedUrlSupport = {
  generateSharedUrl(storeState: StoreState): string {
    const projectData = generateProjectData(storeState);
    const text = JSON.stringify(projectData);
    const compressed = LZString.compressToEncodedURIComponent(text);
    return `${location.origin}?data=${compressed}`;
  },
  loadUrlDataIfExists(): Partial<StoreState> | undefined {
    try {
      const url = new URLSearchParams(location.search);
      const text = url.get("data");
      if (text) {
        const decompressed = LZString.decompressFromEncodedURIComponent(text);
        const projectData = JSON.parse(decompressed) as ProjectData;
        if (projectData.format === projectFormatKey) {
          return projectData.states;
        }
      }
    } catch (error) {
      console.warn("error parsing shared url data", error);
    }
  },
};
