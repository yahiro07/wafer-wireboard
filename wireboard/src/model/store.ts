import { seqNumbers } from "mofur/ax";
import { createStore } from "snap-store";
import { appConfig } from "@/base/app-config";
import { FieldSight } from "@/components/field-sight-plane";
import { createBuiltinKeyboardUnit } from "@/internal-units/keyboard/keyboard";
import { createBuiltinVisualizerUnit } from "@/internal-units/visualizer/visualizer";
import { Scene, UnitItem } from "@/model/types";

export type StoreState = {
  unitItems: UnitItem[];
  sight: FieldSight;
  notes: number[];
  bpm: number;
  playing: boolean;
  masterVolume: number;
  infoPanelVisible: boolean;
  draggingCoverVisible: boolean;
  scenes: Scene[];
  currentSceneId: string;
  sceneSwitcherVisible: boolean;
};

export const store = createStore<StoreState>({
  unitItems: [],
  sight: { eyeScaling: 0.5, eyeOffset: { x: 0, y: 0 } },
  notes: [],
  bpm: 120,
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
});

function buildDefaultScene() {
  const by = 2400;
  if (!appConfig.isDebug || 1) {
    const unitItems: UnitItem[] = [
      {
        destUnitId: "$output",
        unitId: "builtInPreOutput",
        templateFn: createBuiltinVisualizerUnit,
        position: { x: 4500, y: by + 50 },
      },
      {
        destUnitId: "builtInPreOutput",
        unitId: "unit1",
        catalogKey: "miniSynthGe",
        position: { x: 4500, y: by + 260 },
      },
      // {
      //   destUnitId: "unit1",
      //   unitId: "unit2",
      //   catalogKey: "perseq",
      //   position: { x: 4500, y: by + 450 },
      // },
      {
        destUnitId: "unit1",
        unitId: "builtInKeyboard",
        templateFn: createBuiltinKeyboardUnit,
        position: { x: 4600, y: by + 640 },
      },
      // {
      //   unitId: "chordCaster1",
      //   catalogKey: "chordCaster",
      //   position: { x: 4000, y: by + 450 },
      // },
    ];
    store.setUnitItems(unitItems);
    store.patchSight({ eyeScaling: 1.0, eyeOffset: { x: 200, y: 250 } });
  } else {
    const by = 2400;
    const unitItems: UnitItem[] = [
      {
        destUnitId: "$output",
        unitId: "builtInPreOutput",
        templateFn: createBuiltinVisualizerUnit,
        position: { x: 4500, y: by + 100 },
      },
      {
        unitId: "builtInKeyboard",
        templateFn: createBuiltinKeyboardUnit,
        position: { x: 4600, y: by + 620 },
      },
    ];
    store.setUnitItems(unitItems);
  }
}
buildDefaultScene();
