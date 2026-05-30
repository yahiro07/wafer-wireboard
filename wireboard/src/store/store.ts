import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { CatalogKey } from "@/base/showcase-entries";
import {
  createFieldSightHandlers,
  FieldSight,
} from "@/components-ex/field-sight-plane";

export type UnitItem = {
  unitId: string;
  destUnitId?: string;
  catalogKey: CatalogKey;
  position: { x: number; y: number };
};

export type StoreState = {
  unitItems: UnitItem[];
  sight: FieldSight;
};

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);

export const store = createStore<StoreState>({
  unitItems: [],
  sight: { zoom: -1, eyeOffset: { x: 0, y: 0 } },
});

export const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minZoom: -3, maxZoom: 2 },
);

function buildDefaultScene() {
  const bx = 4000;
  const by = 2500;
  const unitItems: UnitItem[] = [
    {
      unitId: "unit1",
      destUnitId: "$output",
      catalogKey: "specbar",
      position: { x: bx + 100, y: by + 100 },
    },
    {
      unitId: "unit2",
      destUnitId: "unit1",
      catalogKey: "miniSynth",
      position: { x: bx + 150, y: by + 360 },
    },
    {
      unitId: "unit3",
      destUnitId: "unit2",
      catalogKey: "mu4Keyboard",
      position: { x: bx + 180, y: by + 620 },
    },
  ];
  store.setUnitItems(unitItems);
}
buildDefaultScene();
