import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInventorySpec } from "wafer-host/vite-plugin";
import { createBuiltinKeyboardUnit } from "@/internal-units/keyboard/keyboard";
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
};

const internalUnitKeys = {
  builtInKeyboard: "builtInKeyboard",
  builtInVisualizer: "builtInVisualizer",
  warpMixEmitter: "warpMixEmitter",
  warpMixReceiver: "warpMixReceiver",
  builtInVolume: "builtInVolume",
} as const;

export type CatalogKey =
  | keyof typeof _catalog
  | keyof typeof internalUnitFunctions;

export const catalog = _catalog as Record<CatalogKey, UnitInventorySpec>;

export type ShowcaseEntry = {
  name: string;
  catalogKey: CatalogKey;
  thumbnailUrl?: string;
};

export const showcaseEntries: ShowcaseEntry[] = [
  ...Object.values(catalog).map((item) => ({
    name: item.name,
    catalogKey: item.catalogKey as CatalogKey,
    thumbnailUrl: item.thumbnailUrl,
  })),
  //builtInKeyboard and builtInVisualizer are omit from showcase entries
  { name: "warp mix emitter", catalogKey: internalUnitKeys.warpMixEmitter },
  { name: "warp mix receiver", catalogKey: internalUnitKeys.warpMixReceiver },
  { name: "volume", catalogKey: internalUnitKeys.builtInVolume },
];

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
