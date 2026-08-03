import { delayMs } from "mofur/ax";
import {
  createHostSystem,
  HostSystem,
  sequencerTickDriverHelper,
  WebAudioActionScheduler,
} from "wafer-host/core";

type OfflineActionScheduler = WebAudioActionScheduler & {
  flush(): void;
};

const calcSongBarDurationSec = (bpm: number): number => {
  return (4 * 60) / bpm;
};

function createOfflineActionScheduler(
  offlineAudioContext: OfflineAudioContext,
  aheadTimeMs = 50,
): OfflineActionScheduler {
  type ScheduledAction = {
    action: () => void;
    time: number;
  };

  const queue: ScheduledAction[] = [];
  const aheadTimeSec = aheadTimeMs / 1000;
  const epsilon = 1 / offlineAudioContext.sampleRate;

  function enqueue(scheduledAction: ScheduledAction) {
    const insertIndex = queue.findIndex(
      (item) => item.time > scheduledAction.time,
    );
    if (insertIndex === -1) {
      queue.push(scheduledAction);
    } else {
      queue.splice(insertIndex, 0, scheduledAction);
    }
  }

  function flush() {
    const thresholdTime =
      offlineAudioContext.currentTime + aheadTimeSec + epsilon;
    while (queue.length > 0 && queue[0].time <= thresholdTime) {
      const scheduledAction = queue.shift();
      scheduledAction?.action();
    }
  }

  return {
    pushAction(action: () => void, time?: number) {
      const scheduledTime = time ?? offlineAudioContext.currentTime;
      const thresholdTime =
        offlineAudioContext.currentTime + aheadTimeSec + epsilon;

      if (scheduledTime <= thresholdTime) {
        action();
        return;
      }

      enqueue({ action, time: scheduledTime });
    },
    flush,
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

  const offlineActionScheduler =
    createOfflineActionScheduler(offlineAudioContext);
  const offlineHost = createHostSystem(offlineAudioContext, {
    customActionScheduler: offlineActionScheduler,
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
    offlineActionScheduler.flush();

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
      offlineActionScheduler.flush();
      scheduleUntil(offlineAudioContext.currentTime + lookaheadSec);
      offlineActionScheduler.flush();

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
