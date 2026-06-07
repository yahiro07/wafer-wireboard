import { Point } from "mofur/ax-ui";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { ReactUnitTemplateFn } from "wus-host/react";
import { CatalogKey } from "@/base/showcase-entries";
import {
  createFieldSightHandlers,
  FieldSight,
} from "@/features/main-edit-area/field-sight-plane";
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

export type StoreState = {
  unitItems: UnitItem[];
  sight: FieldSight;
  notes: number[];
  bpm: number;
  playing: boolean;
  masterVolume: number;
  infoPanelVisible: boolean;
  draggingCoverVisible: boolean;
};

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);

export const store = createStore<StoreState>({
  unitItems: [],
  sight: { eyeScaling: 0.5, eyeOffset: { x: 0, y: 0 } },
  notes: [],
  bpm: 120,
  playing: false,
  masterVolume: 0.5,
  infoPanelVisible: false,
  draggingCoverVisible: false,
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
        catalogKey: "protoEnginePtmOsc",
        position: { x: 4500, y: by + 360 },
      },
      {
        unitId: "builtInKeyboard",
        destUnitId: "unit1",
        templateFn: createBuiltinKeyboardUnit,
        position: { x: 4600, y: by + 620 },
      },
    ];
    store.setUnitItems(unitItems);
    store.patchSight({ eyeScaling: 1.3, eyeOffset: { x: -400, y: 0 } });
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
