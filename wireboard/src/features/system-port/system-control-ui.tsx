import { ScalerBoxAutoSized } from "mofur/mo-react";
import { Button } from "@/components/button";
import { Icons } from "@/components/icons";
import { Knob } from "@/components/knob";
import { NumberSliderBox } from "@/components/number-slider-box";
import { UpperLabel } from "@/components/upper-label";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export const SystemControlUiA = () => {
  const { playing, bpm } = store.useSnapshot();
  return (
    <ScalerBoxAutoSized>
      <div className="flex-ha gap-4 pt-4 pb-1.5 px-4">
        <Button active={playing} onClick={actions.togglePlayState}>
          <Icons.Play size={20} />
        </Button>
        <UpperLabel label="BPM">
          <NumberSliderBox
            value={bpm}
            min={80}
            max={160}
            step={1}
            onChange={actions.setBpm}
            fracDigits={0}
          />
        </UpperLabel>
      </div>
    </ScalerBoxAutoSized>
  );
};

export const SystemControlUiB = () => {
  const { masterVolume } = store.useSnapshot();
  return (
    <ScalerBoxAutoSized>
      <div className="flex-ha gap-2 pt-5.5 pb-2.5">
        <UpperLabel label="MASTER" yOffset={-1}>
          <Knob value={masterVolume} onChange={actions.setMasterVolume} />
        </UpperLabel>
      </div>
    </ScalerBoxAutoSized>
  );
};
