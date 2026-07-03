import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInventorySpec } from "wafer-host/vite-plugin";
import _catalog from "../unit-inventories.json";

export type CatalogKey = keyof typeof _catalog;

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
