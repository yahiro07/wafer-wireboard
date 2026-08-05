import {
  createSequencerTickDriverCore,
  HostSystem,
  oxLogger,
  sequencerTickDriverHelper,
} from "wafer-host/core";

export type PartialSequencerTickDriver = {
  setBpm(bpm: number): void;
  start(targetUnitIds: string[]): void;
  stop(): void;
};

export function createPartialSequencerTickDriver(
  hostSystem: HostSystem,
): PartialSequencerTickDriver {
  const { processUnitsStartStop, processUnitsScheduling } =
    sequencerTickDriverHelper;
  const core = createSequencerTickDriverCore(hostSystem.audioContext, 25, 100);
  let tickFrameIndex = 0;
  let playing = false;
  let targetUnitIds: string[] | undefined;

  const getTargetUnits = () => {
    return hostSystem
      .getAllUnits()
      .filter((unit) => targetUnitIds?.includes(unit.unitId));
  };

  return {
    setBpm: core.setBpm,
    start(_targetUnitIds) {
      if (!playing) {
        targetUnitIds = _targetUnitIds;
        tickFrameIndex = 0;
        oxLogger.clockingStart();
        processUnitsStartStop(getTargetUnits(), "start");
        core.start({
          processScheduling(timeFrom, barFrom, barTo, bpm) {
            oxLogger.clockingFrameStart(tickFrameIndex);
            const units = getTargetUnits();
            processUnitsScheduling(units, timeFrom, barFrom, barTo, bpm);
            oxLogger.clockingFrameEnd(tickFrameIndex);
            tickFrameIndex++;
          },
        });
        playing = true;
      }
    },
    stop() {
      if (playing) {
        core.stop();
        processUnitsStartStop(getTargetUnits(), "stop");
        oxLogger.clockingStop();
        playing = false;
        targetUnitIds = undefined;
      }
    },
  };
}
