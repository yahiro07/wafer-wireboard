import { Point } from "mofur/ax-ui";
import { HsUnitStateData } from "wafer-host/core";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { CatalogKey } from "@/base/showcase-entries";

export type UnitItem = {
  unitId: string | "builtInPreOutput" | "builtInKeyboard";
  destUnitId?: string;
  catalogKey?: CatalogKey;
  templateFn?: ReactUnitTemplateFn;
  moduleUrl?: string;
  position: Point;
  fileChangeRevision?: number;
};

export type Scene = {
  sceneId: string;
  unitStates: HsUnitStateData[];
};
