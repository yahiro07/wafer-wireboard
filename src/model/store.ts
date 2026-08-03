import { seqNumbers } from "mofur/ax";
import { createStore } from "snap-store";
import { FieldSight } from "@/components/field-sight-plane";
import {
  LiveClockingTarget,
  ModalPanelKind,
  PortItem,
  Scene,
  UnitItem,
  WireItem,
} from "@/model/types";

export type StoreState = {
  unitItems: UnitItem[];
  portItems: Record<string, PortItem>;
  wireItems: WireItem[];
  sight: FieldSight;
  bpm: number;
  songKey: string;
  playing: boolean;
  masterVolume: number;
  infoPanelVisible: boolean;
  draggingCoverVisible: boolean;
  scenes: Scene[];
  currentSceneId: string;
  sceneSwitcherVisible: boolean;
  liveClockingTarget: LiveClockingTarget;
  draggingPortKey: string | null;
  previewDestPortKey: string | null;
  tappingPortKey: string | null;
  modalPanelKind: ModalPanelKind | null;
  unitsLoading: boolean;
  projectLoadedIndex: number;
  partialPlayTargetUnitIds: string[];
  hideWarpedWires: boolean;
  wireVertical: boolean;
};

export const store = createStore<StoreState>({
  unitItems: [],
  portItems: {},
  wireItems: [],
  sight: { eyeScaling: 0.5, eyeOffset: { x: 0, y: 0 } },
  bpm: 120,
  songKey: "Am",
  playing: false,
  masterVolume: 0.5,
  infoPanelVisible: false,
  draggingCoverVisible: false,
  scenes: seqNumbers(4).map((i) => ({
    sceneId: `scene${i}`,
    unitStates: [],
  })),
  currentSceneId: "scene0",
  sceneSwitcherVisible: false,
  liveClockingTarget: "chain",
  draggingPortKey: null,
  previewDestPortKey: null,
  tappingPortKey: null,
  modalPanelKind: null,
  unitsLoading: false,
  projectLoadedIndex: 0,
  partialPlayTargetUnitIds: [],
  hideWarpedWires: false,
  wireVertical: true,
});
