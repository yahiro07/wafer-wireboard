import { Point } from "mofur/ax-ui";
import { DestinationCode } from "wus-host/host";
import { ReactUnitTemplateFn } from "wus-host/react";
import { PortSubtype } from "wus-unit-types";

export type PortDirection = "input" | "output";

export type UnitItem = {
  unitId: string;
  pageUrl?: string;
  unitTemplateFn?: ReactUnitTemplateFn;
  destSpec?: DestinationCode;
  position: Point; //top-left corner of the unit box
};

export type PortItem = {
  // position: Point; //center position of the port
  relativePositionInUnit: Point; //relative coord from top-left of the unit box
  unitId: string;
  direction: PortDirection;
  portSubtypes: PortSubtype[];
};
