import { Point } from "beams/ax-ui/common-types";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { CatalogKey } from "@/base/showcase-entries";
import {
  createFieldSightHandlers,
  FieldSight,
} from "@/components-ex/field-sight-plane";

export type UnitItem = {
  unitId: string | "builtInPreOutput" | "builtInKeyboard";
  destUnitId?: string;
  catalogKey: CatalogKey;
  position: Point;
};

export type StoreState = {
  unitItems: UnitItem[];
  sight: FieldSight;
  notes: number[];
  bpm: number;
  playing: boolean;
  masterVolume: number;
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
});
export const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minScaling: 0.125, maxScaling: 4 },
);

function buildDefaultScene() {
  const by = 2400;
  const unitItems: UnitItem[] = [
    {
      destUnitId: "$output",
      unitId: "builtInPreOutput",
      catalogKey: "mu5Visualizer",
      position: { x: 4500, y: by + 100 },
    },
    {
      unitId: "unit1",
      destUnitId: "builtInPreOutput",
      catalogKey: "miniSynth",
      position: { x: 4500, y: by + 360 },
    },
    {
      unitId: "builtInKeyboard",
      destUnitId: "unit1",
      catalogKey: "mu4Keyboard",
      position: { x: 4600, y: by + 620 },
    },
  ];
  store.setUnitItems(unitItems);
}
buildDefaultScene();
