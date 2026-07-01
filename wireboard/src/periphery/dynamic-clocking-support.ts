import { hostSystem, sequencerTickDriver } from "@/model/host-system-instance";
import { store } from "@/model/store";

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
};

function getBuiltinKeyboardDestUnitId() {
  const keyboardUnitId = "builtInKeyboard";
  const keyboardUnitItem = store.state.unitItems.find(
    (item) => item.unitId === keyboardUnitId,
  );
  return keyboardUnitItem?.destUnitId;
}

export function setupDynamicClockingSupport() {
  let numNotes = 0;
  let localPlaying = false;
  hostSystem.setUnitNoteOutputMonitor((args) => {
    if (args.isOn) {
      if (numNotes === 0 && !store.state.playing && !localPlaying) {
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
      if (numNotes === 0 && !store.state.playing && localPlaying) {
        const { liveClockingTarget } = store.state;
        if (liveClockingTarget !== "none") {
          queueMicrotask(sequencerTickDriver.stop);
          const flags = flagsGenerator.allActive();
          sequencerTickDriver.setUnitClockingFlags(flags);
        }
        localPlaying = false;
      }
    }
  });
  return () => {
    hostSystem.setUnitNoteOutputMonitor(undefined);
  };
}
