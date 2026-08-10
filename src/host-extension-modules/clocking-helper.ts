import { HsUnitInstance, ConnectionRule } from "wafer-host/core";

export function sortUnitsForClocking(
  units: HsUnitInstance[],
  rules: ConnectionRule[],
) {
  return units.sort((a, b) => {
    const aIsPreOutput = a.unitId === "builtInPreOutput";
    const bIsPreOutput = b.unitId === "builtInPreOutput";
    if (aIsPreOutput !== bIsPreOutput) {
      return aIsPreOutput ? 1 : -1;
    }
    if (
      rules.some(
        (rule) => rule.srcUnitId === a.unitId && rule.destUnitId === b.unitId,
      )
    ) {
      return -1;
    }
    if (
      rules.some(
        (rule) => rule.srcUnitId === b.unitId && rule.destUnitId === a.unitId,
      )
    ) {
      return 1;
    }
    return 0;
  });
}
