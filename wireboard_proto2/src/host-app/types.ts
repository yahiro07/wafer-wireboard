import { Point } from "beams/ax-ui/common-types";
import { ReactUnitTemplateFn } from "@/framework/unit-frame/react-unit-interface";

export type PortDirection = "input" | "output";

export type UnitItem = {
  unitId: string;
  pageUrl?: string;
  unitTemplateFn?: ReactUnitTemplateFn;
  destSpec?: string | string[];
  position: Point; //top-left corner of the unit box
};

export type PortItem = {
  position: Point; //center position of the port
  relativePositionInUnit: Point; //relative coord from top-left of the unit box
};
