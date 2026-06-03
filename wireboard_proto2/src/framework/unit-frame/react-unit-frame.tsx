import { useEffect, useMemo } from "react";
import { hostSystem } from "@/framework/host/host-system";
import { HsUnitInstance } from "@/framework/host/host-types";
import { extractArray } from "@/framework/unit-frame/helper";
import {
  instantiateReactUnit,
  ReactUnitTemplateFn,
} from "@/framework/unit-frame/react-unit-interface";

export const ReactUnitFrame = ({
  unitId,
  unitTemplateFn,
  destSpec,
  loadedCallback,
}: {
  unitId: string;
  unitTemplateFn: ReactUnitTemplateFn;
  destSpec?: string | string[];
  loadedCallback?(unitInstance: HsUnitInstance): void;
}) => {
  const unit = useMemo(
    () => instantiateReactUnit(unitTemplateFn, unitId),
    [unitTemplateFn, unitId],
  );
  useEffect(() => {
    loadedCallback?.(unit);
    return hostSystem.addUnitInstance(unit);
  }, [unit, loadedCallback]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: variable length deps
  useEffect(() => {
    hostSystem.reserveConnectionChange(unitId, destSpec);
  }, [...extractArray(destSpec), unit]);

  return <unit.RenderUi />;
};
