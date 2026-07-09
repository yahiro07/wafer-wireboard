import { uniqueArrayItems } from "mofur/ax";
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

export function createPartialPlaybackSupportCore() {
  let partialPlaying = false;
  return {
    updatePartialPlayback(originatorUnitIds: string[] | null) {
      if (originatorUnitIds) {
        const unitIds = uniqueArrayItems(
          originatorUnitIds.flatMap(collectUnitIdsToTreeTreeEnd),
        );
        const flags = flagsGenerator.inclusive(unitIds);
        sequencerTickDriver.setUnitClockingFlags(flags);
      } else {
        const flags = flagsGenerator.allActive();
        sequencerTickDriver.setUnitClockingFlags(flags);
      }

      const nextPlaying =
        (originatorUnitIds && originatorUnitIds.length > 0) ?? false;
      if (!partialPlaying && nextPlaying) {
        sequencerTickDriver.start();
      } else if (partialPlaying && !nextPlaying) {
        sequencerTickDriver.stop();
      }
      partialPlaying = nextPlaying;
    },
  };
}
