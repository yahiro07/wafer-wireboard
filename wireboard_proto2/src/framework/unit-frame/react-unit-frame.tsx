import { useEffect, useMemo } from "react";
import { hostSystem } from "@/framework/host/host-system";
import { connectUnitToDestination } from "@/framework/host/unit-connecter";
import {
  instantiateReactUnit,
  ReactUnitTemplateFn,
} from "@/framework/unit-frame/react-unit-interface";

export const ReactUnitFrame = ({
  unitId,
  unitTemplateFn,
  destSpec,
}: {
  unitId: string;
  unitTemplateFn: ReactUnitTemplateFn;
  destSpec?: string | string[];
}) => {
  const unit = useMemo(
    () => instantiateReactUnit(unitTemplateFn, unitId),
    [unitTemplateFn, unitId],
  );
  useEffect(() => {
    return hostSystem.registerUnitInstance(unit);
  }, [unit]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: variable length deps
  useEffect(() => {
    if (destSpec) {
      return connectUnitToDestination(unit, destSpec);
    }
  }, [...(Array.isArray(destSpec) ? destSpec : [destSpec]), unit]);

  return <unit.RenderUi />;
};
