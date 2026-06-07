import {
  Button,
  Knob,
  NumberSliderBox,
  UpperLabel,
} from "mofur-components/mono2";
import { Icons } from "@/base/icons";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export const TopControlBar = () => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  return (
    <div className="absolute top-0 left-0 w-full p-1 flex-c">
      <div className="bg-gray-500 flex-c px-4 gap-4 pt-3.5 pb-1.5">
        <div className="flex-ha gap-4">
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
        <div className="flex-ha gap-2">
          <UpperLabel label="MASTER" yOffset={-1}>
            <Knob value={masterVolume} onChange={actions.setMasterVolume} />
          </UpperLabel>
        </div>
      </div>
    </div>
  );
};
