import { Point } from "beams/ax-ui/common-types";
import { ReactUnitTemplateFn } from "@/framework/unit-frame/react-unit-interface";

export type UnitItem = {
  unitId: string;
  pageUrl?: string;
  unitTemplateFn?: ReactUnitTemplateFn;
  destSpec?: string | string[];
  position: Point;
};
