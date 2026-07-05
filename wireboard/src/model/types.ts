import { Point } from "mofur/ax-ui";
import { HsUnitStateData } from "wafer-host/core";
import { CatalogKey } from "@/base/showcase-entries";
import { InternalUnitKey } from "@/model/internal-unit-definitions";

export type AppUnitDestinationSpec = Record<string, string[]>;

export type UnitItem = {
  unitId: string | "builtInPreOutput" | "builtInKeyboard";
  destSpec?: AppUnitDestinationSpec;
  catalogKey?: CatalogKey;
  internalUnitKey?: InternalUnitKey;
  position: Point;
  fileChangeRevision?: number;
};

export type Scene = {
  sceneId: string;
  unitStates: HsUnitStateData[];
};

export type LiveClockingTarget = "none" | "single" | "chain" | "all";
