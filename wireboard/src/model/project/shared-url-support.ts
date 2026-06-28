import LZString from "lz-string";
import {
  applyProjectData,
  generateProjectData,
  ProjectData,
} from "./project-data-helper";

export function generateSharedUrl() {
  const projectData = generateProjectData();
  const text = JSON.stringify(projectData);
  const compressed = LZString.compressToEncodedURIComponent(text);
  return `${location.origin}?data=${compressed}`;
}

export function loadUrlDataIfExists(): boolean {
  const url = new URLSearchParams(location.search);
  const text = url.get("data");
  if (text) {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(text);
      const projectData = JSON.parse(decompressed) as ProjectData;
      const loaded = applyProjectData(projectData);
      if (loaded) return true;
    } catch (error) {
      console.warn("error applying shared url data", error);
    }
  }
  return false;
}
