import { useEffect, useMemo } from "react";
import { hostSystem } from "@/framework/host/host-system";
import { HsUnitInstance } from "@/framework/host/host-types";
import { connectUnitToDestination } from "@/framework/host/unit-connecter";
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
    return hostSystem.registerUnitInstance(unit);
  }, [unit, loadedCallback]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: variable length deps
  useEffect(() => {
    if (destSpec) {
      return connectUnitToDestination(unit, destSpec);
    }
  }, [...(Array.isArray(destSpec) ? destSpec : [destSpec]), unit]);

  return <unit.RenderUi />;
};
