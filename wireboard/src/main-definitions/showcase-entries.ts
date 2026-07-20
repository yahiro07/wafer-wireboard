import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInventorySpec } from "wafer-host/vite-plugin";
import { createAdvancedControlUnit } from "@/internal-units/advanced-control";
import { createBuiltinKeyboardUnit } from "@/internal-units/keyboard/keyboard";
import { createNoteHubUnit } from "@/internal-units/note-hub";
import { createBuiltinVisualizerUnit } from "@/internal-units/visualizer/visualizer";
import { createVolumeUnit } from "@/internal-units/volume";
import { createWarpMixEmitterUnit } from "@/internal-units/warp-mix-emitter";
import { createWarpMixReceiverUnit } from "@/internal-units/warp-mix-receiver";
import _catalog from "../unit-inventories.json";

const internalUnitFunctions = {
  builtInKeyboard: createBuiltinKeyboardUnit,
  builtInVisualizer: createBuiltinVisualizerUnit,
  warpMixEmitter: createWarpMixEmitterUnit,
  warpMixReceiver: createWarpMixReceiverUnit,
  builtInVolume: createVolumeUnit,
  builtInNoteHub: createNoteHubUnit,
  advancedControl: createAdvancedControlUnit,
};

const internalUnitKeys = {
  builtInKeyboard: "builtInKeyboard",
  builtInVisualizer: "builtInVisualizer",
  warpMixEmitter: "warpMixEmitter",
  warpMixReceiver: "warpMixReceiver",
  builtInVolume: "builtInVolume",
  builtInNoteHub: "builtInNoteHub",
  advancedControl: "advancedControl",
} as const;

export type CatalogKey =
  | keyof typeof _catalog
  | keyof typeof internalUnitFunctions;

export const catalog = _catalog as Record<CatalogKey, UnitInventorySpec>;

export type ShowcaseEntry = {
  name: string;
  catalogKey: CatalogKey;
  thumbnailUrl?: string;
  isBeta?: boolean;
};

const betaUnitKeys: CatalogKey[] = [
  "lofi2",
  "noiseMix",
  "sunsetChorusMini",
  "multiLfo",
  "stepAutomator",
  "rootProg",
  "bs03",
  "mop2",
  "mpd1",
  "s7",
];

export const showcaseEntries: ShowcaseEntry[] = [
  ...Object.values(catalog).map((item) => ({
    name: item.name,
    catalogKey: item.catalogKey as CatalogKey,
    thumbnailUrl: item.thumbnailUrl,
    isBeta: betaUnitKeys.includes(item.catalogKey as CatalogKey),
  })),
  //builtInKeyboard and builtInVisualizer are omit from showcase entries
  { name: "warp mix emitter", catalogKey: internalUnitKeys.warpMixEmitter },
  { name: "warp mix receiver", catalogKey: internalUnitKeys.warpMixReceiver },
  { name: "volume", catalogKey: internalUnitKeys.builtInVolume },
  { name: "note hub", catalogKey: internalUnitKeys.builtInNoteHub },
  { name: "advanced control", catalogKey: internalUnitKeys.advancedControl },
];

export const unitNamesMap = Object.fromEntries(
  showcaseEntries.map((item) => [item.catalogKey, item.name]),
);

export function getCatalogItem(
  catalogKey: CatalogKey,
): UnitInventorySpec | undefined {
  return catalog[catalogKey as keyof typeof catalog];
}

export function getInternalUnitFunction(
  catalogKey: CatalogKey,
): ReactUnitTemplateFn | undefined {
  return internalUnitFunctions[
    catalogKey as keyof typeof internalUnitFunctions
  ];
}

export type CatalogTarget =
  | { type: "catalog"; UnitInventorySpec: UnitInventorySpec }
  | { type: "internal"; internalUnitFunction: ReactUnitTemplateFn };

export function getCatalogTarget(
  catalogKey: CatalogKey,
): CatalogTarget | undefined {
  const catalogItem = getCatalogItem(catalogKey);
  if (catalogItem) {
    return { type: "catalog", UnitInventorySpec: catalogItem };
  }
  const internalUnitFunction = getInternalUnitFunction(catalogKey);
  if (internalUnitFunction) {
    return { type: "internal", internalUnitFunction };
  }
}
