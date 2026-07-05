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

export type PortDirection = "input" | "output";
export type PortSubtype = "audio" | "note" | "automation";

export type PortItem = {
  portKey: string; //${unitId}.${portId}, portIds are "primaryOut", "primaryIn", or arbitrary id for additional ports
  direction: PortDirection;
  subtypes: PortSubtype[];
  position: Point;
};
