import { delayMs } from "@/auxiliaries/helpers";
import {
  createHostSystem,
  HostSystem,
  NotesDispatcher,
  sequencerTickDriverHelper,
} from "wafer-host/core";

type OfflineNotesDispatcher = NotesDispatcher & {
  flush(): void;
};

const calcSongBarDurationSec = (bpm: number): number => {
  return (4 * 60) / bpm;
};

function createOfflineNotesDispatcher(
  offlineAudioContext: OfflineAudioContext,
  aheadTimeMs = 50,
): OfflineNotesDispatcher {
  type ScheduledAction = {
    action: () => void;
    time: number;
  };

  const queue: ScheduledAction[] = [];
  const aheadTimeSec = aheadTimeMs / 1000;
  const epsilon = 1 / offlineAudioContext.sampleRate;

  const internal = {
    enqueue(scheduledAction: ScheduledAction) {
      const insertIndex = queue.findIndex(
        (item) => item.time > scheduledAction.time,
      );
      if (insertIndex === -1) {
        queue.push(scheduledAction);
      } else {
        queue.splice(insertIndex, 0, scheduledAction);
      }
    },
    flush() {
      const thresholdTime =
        offlineAudioContext.currentTime + aheadTimeSec + epsilon;
      while (queue.length > 0 && queue[0].time <= thresholdTime) {
        const scheduledAction = queue.shift();
        scheduledAction?.action();
      }
    },
    pushAction(action: () => void, time?: number) {
      const scheduledTime = time ?? offlineAudioContext.currentTime;
      const thresholdTime =
        offlineAudioContext.currentTime + aheadTimeSec + epsilon;

      if (scheduledTime <= thresholdTime) {
        action();
        return;
      }
      internal.enqueue({ action, time: scheduledTime });
    },
  };

  return {
    //TODO: implement handlers
    pushNoteDeliveryEvent(_noteDeliveryEvent) {},
    pushAutomationDeliveryEvent(_automationDeliveryEvent) {},
    setUnitNoteOutputMonitor() {},
    flush: internal.flush,
  };
}

const { processUnitsStartStop, processUnitsScheduling } =
  sequencerTickDriverHelper;

export function createOfflineRenderingDriver_SimulateRealtimeTickDriver(
  offlineAudioContext: OfflineAudioContext,
  numBars: number,
  bpm: number,
  sceneSetupFn: (offlineHost: HostSystem) => Promise<void>,
  unitClockingFlags: Record<string, boolean>,
  config: { intervalMs: number; lookaheadMs: number } = {
    intervalMs: 25,
    lookaheadMs: 100,
  },
) {
  function mapTimeToBar(timeSec: number, bpm: number): number {
    const minutes = timeSec / 60;
    const beats = minutes * bpm;
    return beats / 4;
  }
  const durationSec = calcSongBarDurationSec(bpm) * numBars;
  const intervalSec = config.intervalMs / 1000;
  const lookaheadSec = config.lookaheadMs / 1000;
  const renderEndEpsilonSec = 1 / offlineAudioContext.sampleRate;

  const offlineNotesDispatcher =
    createOfflineNotesDispatcher(offlineAudioContext);
  const offlineHost = createHostSystem(offlineAudioContext, {
    customNotesDispatcher: offlineNotesDispatcher,
  });

  const run = async () => {
    await sceneSetupFn(offlineHost);
    const clockTargetUnits = offlineHost
      .getAllUnits()
      .filter((unit) => unitClockingFlags[unit.unitId] !== false);

    processUnitsStartStop(clockTargetUnits, "start");

    let scheduledUntil = offlineAudioContext.currentTime;
    let barPos = 0;
    const scheduleUntil = (timeTo: number) => {
      const timeFrom = scheduledUntil;
      const duration = timeTo - timeFrom;
      if (duration <= 0) return;

      const barPosNext = barPos + mapTimeToBar(duration, bpm);
      processUnitsScheduling(
        clockTargetUnits,
        timeFrom,
        barPos,
        barPosNext,
        bpm,
      );
      scheduledUntil = timeTo;
      barPos = barPosNext;
    };

    scheduleUntil(offlineAudioContext.currentTime + lookaheadSec);
    offlineNotesDispatcher.flush();

    let tickIndex = 1;
    const createSuspendPromiseForNextTick = () => {
      const nextTickTime = tickIndex * intervalSec;
      if (nextTickTime >= durationSec - renderEndEpsilonSec) return;
      return offlineAudioContext.suspend(nextTickTime);
    };
    let suspendPromise = createSuspendPromiseForNextTick();
    const renderPromise = offlineAudioContext.startRendering();

    while (suspendPromise) {
      await suspendPromise;
      offlineNotesDispatcher.flush();
      scheduleUntil(offlineAudioContext.currentTime + lookaheadSec);
      offlineNotesDispatcher.flush();

      tickIndex++;
      suspendPromise = createSuspendPromiseForNextTick();
      await offlineAudioContext.resume();
    }

    const buffer = await renderPromise;
    processUnitsStartStop(clockTargetUnits, "stop");
    await delayMs(1000);
    return buffer;
  };
  return { offlineHost, run };
}
