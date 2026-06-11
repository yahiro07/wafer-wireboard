import { ReactUnitTemplateFn } from "wus-host/react";
import { UnitInventorySpec } from "wus-vite-unit-loader-plugin";
import { appConfigs } from "@/base/constants";
import { createChordProgressionUnit } from "@/units/chord-progression/chord-progression-unit";
import { createRtfrUnit } from "@/units/rtfr/rtfr";
import _catalog from "../unit-inventories.json";

const additionalUnitTemplateMap = {
  chordProgression: createChordProgressionUnit,
  rftr: createRtfrUnit,
};

export type CatalogKey =
  | keyof typeof _catalog
  | keyof typeof additionalUnitTemplateMap;

export const catalog = _catalog as Record<CatalogKey, UnitInventorySpec>;

export type ShowcaseEntry = {
  name: string;
  catalogKey: CatalogKey;
  templateFn?: ReactUnitTemplateFn;
  thumbnailUrl?: string;
};

export const showcaseEntries: ShowcaseEntry[] = [
  ...Object.values(catalog).map((item) => ({
    name: item.name,
    catalogKey: item.catalogKey as CatalogKey,
    thumbnailUrl: item.thumbnailUrl,
  })),
];

if (appConfigs.isDevelopment) {
  showcaseEntries.push(
    ...Object.entries(additionalUnitTemplateMap).map(([key, templateFn]) => ({
      name: key,
      catalogKey: key as CatalogKey,
      templateFn,
    })),
  );
}
