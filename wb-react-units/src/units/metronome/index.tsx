import { ReactUnitTemplateFn } from "wus-host/react";
import { makeStepSchedulingSource } from "../common/step-scheduling-source";

export const createMetronomeUnit: ReactUnitTemplateFn = (unitInterface) => {
  const audioContext = unitInterface.audioContext;

  function playTone(freq: number, timeAt: number, duration: number) {
    const osc = audioContext.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(unitInterface.primaryOutputPort.audioOutput.node);
    osc.start(timeAt);
    osc.stop(timeAt + duration);
  }

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "instrument",
      outputs: ["audio"],
      inputs: ["clock"],
    },
    primaryInputPortHandlers: {
      clockInput: {
        processScheduling(startTime, ppqFrom, ppqTo, bpm) {
          const sss = makeStepSchedulingSource(startTime, ppqFrom, ppqTo, bpm);
          for (const point of sss.stepPoints) {
            if (point.stepIndex % 16 === 0) {
              playTone(880, point.time, 0.1);
            } else if (point.stepIndex % 4 === 0) {
              playTone(440, point.time, 0.1);
            }
          }
        },
      },
    },
  });

  return {
    RenderUi() {
      return (
        <div className="w-[400px] h-[100px] bg-gray-200 flex-vc gap-2">
          <div>metronome</div>
        </div>
      );
    },
  };
};
