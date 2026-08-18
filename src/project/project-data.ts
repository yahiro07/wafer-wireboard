import { pickObjectMembers } from "@/auxiliaries/helpers";
import { FieldSight } from "@/components/field-sight-plane";
import { createWireItem } from "@/model/factory";
import { StoreState } from "@/model/store";
import { Scene, UnitItem } from "@/model/types";

export const projectFormatKey = "wireboard-project-data";

export type ProjectDataStates = {
  bpm: number;
  unitItems: UnitItem[];
  wireConnectionKeys: string[];
  sight: FieldSight;
  scene: Scene;
  songKey: string;
};

export type ProjectData = {
  format: typeof projectFormatKey;
  appVersionCode: string;
  states: ProjectDataStates;
};

function mapStoreStateToProjectDataStates(
  storeState: StoreState,
): ProjectDataStates {
  return {
    ...pickObjectMembers(storeState, {
      bpm: 1,
      unitItems: 1,
      sight: 1,
      scene: 1,
      songKey: 1,
    }),
    wireConnectionKeys: storeState.wireItems.map(
      (wireItem) => wireItem.connectionKey,
    ),
  };
}

export function mapPartialStoreStateFromProjectDataStates(
  states: ProjectDataStates,
): Partial<StoreState> {
  return {
    ...pickObjectMembers(states, {
      bpm: 1,
      unitItems: 1,
      sight: 1,
      scene: 1,
      songKey: 1,
    }),
    wireItems: states.wireConnectionKeys.map((key) => {
      const i = key.indexOf("-");
      const sourcePortKey = key.slice(0, i);
      const destinationPortKey = key.slice(i + 1);
      return createWireItem(sourcePortKey, destinationPortKey);
    }),
  };
}

export function generateProjectData(storeState: StoreState): ProjectData {
  const states = mapStoreStateToProjectDataStates(storeState);
  return {
    format: projectFormatKey,
    appVersionCode: "app",
    states,
  };
}
