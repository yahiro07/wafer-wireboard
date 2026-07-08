import { hostSystem, sequencerTickDriver } from "@/model/host-system-instance";
import { store } from "@/model/store";

function traceConnectors(unitId: string): string[] {
  return store.state.wireItems
    .filter((wire) => wire.destinationUnitId === unitId)
    .map((wire) => wire.sourceUnitId);
}

function collectUnitIdsToTreeTreeEnd(startUnitId: string): string[] {
  const unitIds = new Set<string>();

  function visit(unitId: string) {
    if (unitIds.has(unitId)) return;
    unitIds.add(unitId);
    for (const upstreamUnitId of traceConnectors(unitId)) {
      visit(upstreamUnitId);
    }
  }
  visit(startUnitId);

  return [...unitIds];
}

const flagsGenerator = {
  allActive() {
    return Object.fromEntries(
      hostSystem.getAllUnits().map((unit) => [unit.unitId, true]),
    ) as Record<string, boolean>;
  },
  allInactive() {
    return Object.fromEntries(
      hostSystem.getAllUnits().map((unit) => [unit.unitId, false]),
    ) as Record<string, boolean>;
  },
  inclusive(ids: string[]) {
    const flags = flagsGenerator.allInactive();
    ids.forEach((id) => {
      flags[id] = true;
    });
    return flags;
  },
};

export function startPartialPlayback(targetUnitId: string) {
  const unitIds = collectUnitIdsToTreeTreeEnd(targetUnitId);
  const flags = flagsGenerator.inclusive(unitIds);
  sequencerTickDriver.setUnitClockingFlags(flags);
  sequencerTickDriver.start();

  return () => {
    sequencerTickDriver.stop();
    const flags = flagsGenerator.allActive();
    sequencerTickDriver.setUnitClockingFlags(flags);
  };
}
