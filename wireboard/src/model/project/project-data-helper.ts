import { pickObjectMembers } from "mofur/ax";
import { FieldSight } from "@/components/field-sight-plane";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import { Scene, UnitItem } from "@/model/types";

const formatKey = "wireboard-project-data";

export type ProjectData = {
  format: typeof formatKey;
  appVersionCode: string;
  states: {
    bpm: number;
    unitItems: UnitItem[];
    sight: FieldSight;
    scenes: Scene[];
    currentSceneId: string;
    sceneSwitcherVisible: boolean;
  };
};

export function generateProjectData(): ProjectData {
  const states = pickObjectMembers(store.state, {
    bpm: 1,
    unitItems: 1,
    sight: 1,
    scenes: 1,
    currentSceneId: 1,
    sceneSwitcherVisible: 1,
  });
  return {
    format: formatKey,
    appVersionCode: "app",
    states,
  };
}

export function applyProjectData(projectData: ProjectData): boolean {
  const { format, states } = projectData;
  if (format === formatKey) {
    store.assign(states);
    actions.reservePushCurrentSceneStateToHost(true);
    return true;
  }
  return false;
}
