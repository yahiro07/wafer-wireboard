import { createSequencerTickDriver } from "mofur/mx-audio";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wus-host-react/react";
import { Button } from "@/shared/components/button";
import { Icons } from "@/shared/components/icons";
import { NumberSliderBox } from "@/shared/components/number-slider-box";

export const createMasterClockUnit: ReactUnitTemplateFn = (unitInterface) => {
  const tickDriver = createSequencerTickDriver();

  const store = createStore({
    playing: false,
    bpm: 120,
  });

  const clockOutput = unitInterface.primaryOutputPort.clockOutput;

  const actions = {
    togglePlayState() {
      if (!store.state.playing) {
        let stepIndex = 0;
        clockOutput.start?.();
        tickDriver.start({
          processStep() {
            clockOutput.processStep?.(stepIndex++);
          },
        });
        store.setPlaying(true);
      } else {
        clockOutput.stop?.();
        tickDriver.stop();
        store.setPlaying(false);
      }
    },
    setBpm(bpm: number) {
      tickDriver.setBpm(bpm);
      store.setBpm(bpm);
    },
  };

  unitInterface.completeSetupWithAttributes({
    unitFeatures: {
      unitType: "sequencer",
      outputs: ["clock"],
    },
  });

  return {
    RenderUi() {
      const { playing, bpm } = store.useSnapshot();
      return (
        <div className="flex-c gap-4 bg-gray-200 w-[200px] h-[100px]">
          <Button active={playing} onClick={actions.togglePlayState}>
            <Icons.Play />
          </Button>
          <NumberSliderBox
            value={bpm}
            onChange={actions.setBpm}
            min={80}
            max={160}
          />
        </div>
      );
    },
  };
};
