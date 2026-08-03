import { pickObjectMembers } from "mofur/ax";
import { FieldSight } from "@/components/field-sight-plane";
import { StoreState } from "@/model/store";
import { Scene, UnitItem, WireItem } from "@/model/types";

export const projectFormatKey = "wireboard-project-data";

export type ProjectData = {
  format: typeof projectFormatKey;
  appVersionCode: string;
  states: {
    bpm: number;
    unitItems: UnitItem[];
    wireItems: WireItem[];
    sight: FieldSight;
    scenes: Scene[];
    currentSceneId: string;
    sceneSwitcherVisible: boolean;
  };
};

export function generateProjectData(storeState: StoreState): ProjectData {
  const states = pickObjectMembers(storeState, {
    bpm: 1,
    unitItems: 1,
    wireItems: 1,
    sight: 1,
    scenes: 1,
    currentSceneId: 1,
    sceneSwitcherVisible: 1,
  });
  return {
    format: projectFormatKey,
    appVersionCode: "app",
    states,
  };
}
