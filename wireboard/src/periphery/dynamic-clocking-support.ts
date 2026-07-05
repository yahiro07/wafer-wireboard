import { UnitNoteOutputMonitorFn } from "wafer-host/core";
import { hostSystem, sequencerTickDriver } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { getUnitIdFromPortKey } from "@/port/connection-logic";

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
  singleActive(destUnitId?: string) {
    const flags = flagsGenerator.allInactive();
    if (destUnitId) {
      flags[destUnitId] = true;
    }
    return flags;
  },
  inclusive(ids: string[]) {
    const flags = flagsGenerator.allInactive();
    ids.forEach((id) => {
      flags[id] = true;
    });
    return flags;
  },
};

function getDestUnitIds(originatorUnitId: string): string[] {
  const resUnitIds = new Set<string>();
  for (const wire of store.state.wireItems) {
    const sourceUnitId = getUnitIdFromPortKey(wire.sourcePortKey);
    if (sourceUnitId === originatorUnitId) {
      const destinationUnitId = getUnitIdFromPortKey(wire.destinationPortKey);
      resUnitIds.add(destinationUnitId);
    }
  }
  return Array.from(resUnitIds);
}

function getBuiltinKeyboardDestUnitId() {
  const keyboardUnitId = "builtInKeyboard";
  return getDestUnitIds(keyboardUnitId)?.[0];
}

function addUnitGraphIdsUntilOutput(
  unitId: string,
  unitIdsIncluded: Set<string>,
  visitingUnitIds = new Set<string>(),
): boolean {
  if (unitId === "$output") {
    return true;
  }
  if (visitingUnitIds.has(unitId)) {
    return false;
  }

  visitingUnitIds.add(unitId);
  const downstreamUnitIds = new Set<string>();
  const reachesOutput = getDestUnitIds(unitId).reduce(
    (hasReachedOutput, destUnitId) =>
      addUnitGraphIdsUntilOutput(
        destUnitId,
        downstreamUnitIds,
        visitingUnitIds,
      ) || hasReachedOutput,
    false,
  );
  visitingUnitIds.delete(unitId);

  if (reachesOutput) {
    unitIdsIncluded.add(unitId);
    downstreamUnitIds.forEach((id) => {
      unitIdsIncluded.add(id);
    });
  }
  return reachesOutput;
}

function createChainFlagsAffecter() {
  const originatorUnitIds = new Set<string>();
  const unitIdsIncluded = new Set<string>();
  return {
    reset() {
      originatorUnitIds.clear();
      unitIdsIncluded.clear();
    },
    addOriginator(sourceUnitId: string) {
      if (!originatorUnitIds.has(sourceUnitId)) {
        const graphUnitIds = new Set<string>();
        addUnitGraphIdsUntilOutput(sourceUnitId, graphUnitIds);
        const newUnitIds = [...graphUnitIds].filter(
          (id) => !unitIdsIncluded.has(id),
        );
        if (newUnitIds.length > 0) {
          newUnitIds.forEach((id) => {
            unitIdsIncluded.add(id);
          });
          const flags = flagsGenerator.inclusive([...unitIdsIncluded]);
          sequencerTickDriver.setUnitClockingFlags(flags);
        }
        originatorUnitIds.add(sourceUnitId);
      }
    },
  };
}

function createNoteOutputMonitorChained(): UnitNoteOutputMonitorFn {
  let numNotes = 0;
  let localPlaying = false;
  const chainFlagsAffecter = createChainFlagsAffecter();

  return (args) => {
    if (store.state.playing) return;
    if (args.isOn) {
      if (numNotes === 0 && !localPlaying) {
        queueMicrotask(sequencerTickDriver.start);
        chainFlagsAffecter.reset();
        localPlaying = true;
      }
      chainFlagsAffecter.addOriginator(args.sourceUnitId);
      numNotes++;
    } else {
      numNotes--;
      if (numNotes === 0 && localPlaying) {
        const { liveClockingTarget } = store.state;
        if (liveClockingTarget !== "none") {
          queueMicrotask(sequencerTickDriver.stop);
          const flags = flagsGenerator.allActive();
          sequencerTickDriver.setUnitClockingFlags(flags);
        }
        localPlaying = false;
      }
    }
  };
}

function createNoteOutputMonitorSimple(): UnitNoteOutputMonitorFn {
  let numNotes = 0;
  let localPlaying = false;
  return (args) => {
    if (store.state.playing) return;
    if (args.isOn) {
      if (numNotes === 0 && !localPlaying) {
        const { liveClockingTarget } = store.state;
        if (liveClockingTarget !== "none") {
          if (liveClockingTarget === "single") {
            const destUnitId = getBuiltinKeyboardDestUnitId();
            const flags = flagsGenerator.singleActive(destUnitId);
            sequencerTickDriver.setUnitClockingFlags(flags);
          } else {
            const flags = flagsGenerator.allActive();
            sequencerTickDriver.setUnitClockingFlags(flags);
          }
          queueMicrotask(sequencerTickDriver.start);
        }
        localPlaying = true;
      }
      numNotes++;
    } else {
      numNotes--;
      if (numNotes === 0 && localPlaying) {
        const { liveClockingTarget } = store.state;
        if (liveClockingTarget !== "none") {
          queueMicrotask(sequencerTickDriver.stop);
          const flags = flagsGenerator.allActive();
          sequencerTickDriver.setUnitClockingFlags(flags);
        }
        localPlaying = false;
      }
    }
  };
}

export function setupDynamicClockingSupport() {
  const monitorSimple = createNoteOutputMonitorSimple();
  const monitorChained = createNoteOutputMonitorChained();
  hostSystem.setUnitNoteOutputMonitor((args) => {
    if (store.state.liveClockingTarget === "chain") {
      monitorChained(args);
    } else {
      monitorSimple(args);
    }
  });
  return () => {
    hostSystem.setUnitNoteOutputMonitor(undefined);
  };
}
