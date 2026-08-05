import {
  createSequencerTickDriverCore,
  HostSystem,
  HsUnitInstance,
  oxLogger,
  sequencerTickDriverHelper,
} from "wafer-host/core";

export type CustomSequencerTickDriver = {
  setBpm(bpm: number): void;
  start(): void;
  stop(): void;
  setUnitClockingFlag(unitId: string, enabled: boolean): void;
  setUnitClockingFlags(attrs: Record<string, boolean>): void;
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
  let running = false;
  const getAllUnits = () => hostSystem.getAllUnits() as HsUnitInstance[];

  return {
    setBpm: core.setBpm,
    start() {
      if (!running) {
        tickFrameIndex = 0;
        oxLogger.clockingStart();
        processUnitsStartStop(getAllUnits(), "start");
        core.start({
          processScheduling(timeFrom, barFrom, barTo, bpm) {
            oxLogger.clockingFrameStart(tickFrameIndex);
            const units = hostSystem
              .getAllUnits()
              .filter((unit) => unitClockingFlags[unit.unitId] !== false);
            processUnitsScheduling(units, timeFrom, barFrom, barTo, bpm);
            oxLogger.clockingFrameEnd(tickFrameIndex);
            tickFrameIndex++;
          },
        });
        running = true;
      }
    },
    stop() {
      if (running) {
        core.stop();
        processUnitsStartStop(getAllUnits(), "stop");
        oxLogger.clockingStop();
        running = false;
      }
    },
    setUnitClockingFlag(unitId: string, enabled: boolean) {
      unitClockingFlags[unitId] = enabled;
    },
    setUnitClockingFlags(attrs: Record<string, boolean>) {
      Object.assign(unitClockingFlags, attrs);
    },
    getUnitClockingFlags() {
      return unitClockingFlags;
    },
  };
}
