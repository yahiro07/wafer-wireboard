import { UnitInventorySpec } from "wus-vite-unit-loader-plugin";
import _catalog from "../unit-inventories.json";

const catalog = _catalog as Record<string, UnitInventorySpec>;

export { catalog };

export type CatalogKey = keyof typeof catalog;

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
];
