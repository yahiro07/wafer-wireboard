import {
  createSequencerTickDriverCore,
  HostSystem,
  sequencerTickDriverHelper,
} from "wafer-host/core";

export type CustomSequencerTickDriver = {
  setBpm(bpm: number): void;
  start(): void;
  stop(): void;
  setUnitClockingFlag(unitId: string, enabled: boolean): void;
  getUnitClockingFlags(): Record<string, boolean>;
};

export function createCustomSequencerTickDriver(
  hostSystem: HostSystem,
): CustomSequencerTickDriver {
  const { processUnitsStartStop, processUnitsScheduling } =
    sequencerTickDriverHelper;
  const core = createSequencerTickDriverCore(hostSystem.audioContext, 25, 100);
  let tickFrameIndex = 0;
  const unitClockingFlags: Record<string, boolean> = {};

  return {
    setBpm: core.setBpm,
    start() {
      tickFrameIndex = 0;
      processUnitsStartStop(hostSystem.getAllUnits(), "start");
      core.start({
        processScheduling(timeFrom, barFrom, barTo, bpm) {
          const units = hostSystem
            .getAllUnits()
            .filter((unit) => unitClockingFlags[unit.unitId] !== false);
          processUnitsScheduling(units, timeFrom, barFrom, barTo, bpm);
          tickFrameIndex++;
        },
      });
    },
    stop() {
      core.stop();
      processUnitsStartStop(hostSystem.getAllUnits(), "stop");
    },
    setUnitClockingFlag(unitId: string, enabled: boolean) {
      unitClockingFlags[unitId] = enabled;
    },
    getUnitClockingFlags() {
      return unitClockingFlags;
    },
  };
}
