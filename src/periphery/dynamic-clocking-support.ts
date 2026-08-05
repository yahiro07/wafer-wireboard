import { actions } from "@/model/actions";
import {
  hostSystem,
  partialSequencerTickDriver,
} from "@/model/host-system-instance";
import { store } from "@/model/store";
import { LiveClockingTarget } from "@/model/types";

function getNoteDestUnitIds(originatorUnitId: string): string[] {
  const resUnitIds = new Set<string>();
  for (const wire of store.state.wireItems) {
    if (wire.sourcePortKey === `${originatorUnitId}.noteOutput`) {
      resUnitIds.add(wire.destinationUnitId);
    }
  }
  return Array.from(resUnitIds);
}

function gatherReachableUnitsWithNoteInput(originatorUnitId: string): string[] {
  const resUnitIds = getNoteDestUnitIds(originatorUnitId);
  for (let i = 0; i < resUnitIds.length; i++) {
    const unitId = resUnitIds[i];
    const newUnitIds = getNoteDestUnitIds(unitId).filter(
      (id) => !resUnitIds.includes(id),
    );
    resUnitIds.push(...newUnitIds);
  }
  return resUnitIds;
}

export function setupDynamicClockingSupport() {
  type LocalPlaybackOriginatorState = { unitId: string; numNotes: number };
  let originator: LocalPlaybackOriginatorState | null = null;
  let liveClockingTarget: LiveClockingTarget;

  const internal = {
    startLocalPlayback(originatorUnitId: string) {
      liveClockingTarget = store.state.liveClockingTarget;
      if (liveClockingTarget === "chain") {
        const targetUnitIds =
          gatherReachableUnitsWithNoteInput(originatorUnitId);
        partialSequencerTickDriver.start(targetUnitIds);
      } else if (liveClockingTarget === "all") {
        actions.setPlayState(true);
      }
    },
    stopLocalPlayback() {
      if (liveClockingTarget === "chain") {
        partialSequencerTickDriver.stop();
      } else if (liveClockingTarget === "all") {
        actions.setPlayState(false);
      }
    },
  };

  hostSystem.setUnitNoteOutputMonitor((args) => {
    if (
      !store.state.playing &&
      !originator &&
      args.isOn &&
      args.sourceUnitId === "builtInKeyboard"
    ) {
      const unitId = args.sourceUnitId;
      originator = { unitId, numNotes: 1 };
      internal.startLocalPlayback(unitId);
    } else if (args.sourceUnitId === originator?.unitId) {
      originator.numNotes += args.isOn ? 1 : -1;
      if (originator.numNotes === 0) {
        internal.stopLocalPlayback();
        originator = null;
      }
    }
  });
  return () => {
    hostSystem.setUnitNoteOutputMonitor(undefined);
  };
}
