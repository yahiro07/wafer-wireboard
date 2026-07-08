import { Point } from "mofur/ax-ui";
import { HsUnitStateData } from "wafer-host/core";
import { CatalogKey } from "@/main-definitions/showcase-entries";

export type AppUnitDestinationSpec = Record<string, string[]>;

export type UnitItem = {
  unitId: string | "builtInPreOutput" | "builtInKeyboard";
  catalogKey: CatalogKey;
  position: Point;
  hmrRevision?: number;
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
  unitId: string;
  direction: PortDirection;
  subtypes: PortSubtype[];
  position: Point;
};

export type WireItem = {
  connectionKey: string; //${sourcePortKey}-${destinationPortKey}
  sourcePortKey: string;
  destinationPortKey: string;
  sourceUnitId: string;
  destinationUnitId: string;
  hmrRevision?: number;
};

export type ModalPanelKind = "share";
