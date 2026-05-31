import { ScalerBoxAutoSized } from "beams/mo-react/components/scaler-box-auto-sized";
import { Button } from "@/components/button";
import { Icons } from "@/components/icons";
import { NumberSliderBox } from "@/components/number-slider-box";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export const SystemControlUiA = () => {
  const { playing, bpm } = store.useSnapshot();
  return (
    <ScalerBoxAutoSized>
      <div className="flex-ha gap-4 p-4">
        <Button active={playing} onClick={actions.togglePlayState}>
          <Icons.Play size={20} />
        </Button>
        <NumberSliderBox
          value={bpm}
          min={60}
          max={180}
          step={1}
          onChange={actions.setBpm}
          fracDigits={0}
        />
      </div>
    </ScalerBoxAutoSized>
  );
};

export const SystemControlUiB = () => {};
