import { Point } from "mofur/ax-ui";
import { HsUnitStateData } from "wafer-host/core";
import { CatalogKey } from "@/base/showcase-entries";
import { InternalUnitKey } from "@/model/internal-unit-definitions";

export type UnitItem = {
  unitId: string | "builtInPreOutput" | "builtInKeyboard";
  destUnitId?: string;
  catalogKey?: CatalogKey;
  internalUnitKey?: InternalUnitKey;
  moduleUrl?: string;
  position: Point;
  fileChangeRevision?: number;
};

export type Scene = {
  sceneId: string;
  unitStates: HsUnitStateData[];
};

export type LiveClockingTarget = "none" | "single" | "chain" | "all";
