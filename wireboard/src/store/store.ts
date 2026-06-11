import { seqNumbers } from "mofur/ax";
import { Point } from "mofur/ax-ui";
import { createStore } from "snap-store";
import { HsUnitStateData } from "wus-host/host";
import { ReactUnitTemplateFn } from "wus-host/react";
import { CatalogKey } from "@/base/showcase-entries";
import {
  createFieldSightHandlers,
  FieldSight,
} from "@/features/main-edit-area/field-sight-plane";
import { createChordProgressionUnit } from "@/units/chord-progression/chord-progression-unit";
import { createBuiltinKeyboardUnit } from "@/units/keyboard/keyboard";
import { createBuiltinVisualizerUnit } from "@/units/visualizer/visualizer";

const appConfig = {
  isDebug: import.meta.env.DEV,
};

export type UnitItem = {
  unitId: string | "builtInPreOutput" | "builtInKeyboard";
  destUnitId?: string;
  catalogKey?: CatalogKey;
  templateFn?: ReactUnitTemplateFn;
  position: Point;
};

export type Scene = {
  sceneId: string;
  unitStates: HsUnitStateData[];
};

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

export const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minScaling: 0.125, maxScaling: 4 },
);

function buildDefaultScene() {
  const by = 2400;
  if (!appConfig.isDebug || 1) {
    const unitItems: UnitItem[] = [
      {
        destUnitId: "$output",
        unitId: "builtInPreOutput",
        templateFn: createBuiltinVisualizerUnit,
        position: { x: 4500, y: by + 100 },
      },
      {
        unitId: "unit1",
        destUnitId: "builtInPreOutput",
        catalogKey: "miniSynthGe",
        position: { x: 4500, y: by + 360 },
      },
      {
        unitId: "builtInKeyboard",
        destUnitId: "unit1",
        templateFn: createBuiltinKeyboardUnit,
        position: { x: 4600, y: by + 620 },
      },
      {
        unitId: "builtInProgression",
        templateFn: createChordProgressionUnit,
        position: { x: 4100, y: by + 620 },
      },
    ];
    store.setUnitItems(unitItems);
    store.patchSight({ eyeScaling: 1.0, eyeOffset: { x: 0, y: 250 } });
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
