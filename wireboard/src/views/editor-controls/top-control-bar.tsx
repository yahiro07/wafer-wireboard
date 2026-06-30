import { appConfig } from "@/base/app-config";
import { Icons, IconsEx } from "@/base/icons";
import { Button } from "@/components/button";
import { Knob } from "@/components/knob";
import { NumberSliderBox } from "@/components/number-slider-box";
import { UpperLabel } from "@/components/upper-label";
import { actions } from "@/model/actions";
import { store } from "@/model/store";

export const TopControlBar = () => {
  const { playing, bpm, masterVolume, sceneSwitcherVisible } =
    store.useSnapshot();
  return (
    <div className="flex-c px-4 gap-4 pt-3.5 pb-1.5 pointer-events-auto mb-[-3px]">
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
      {appConfig.isDevelopment && false && (
        <button
          onClick={actions.toggleSceneSwitcherVisible}
          className="text-white cursor-pointer p-2 text-xl"
          style={!sceneSwitcherVisible ? { opacity: 0.5 } : undefined}
        >
          <IconsEx.SceneSwitcher />
        </button>
      )}
      <div className="flex-ha gap-2">
        <UpperLabel label="MASTER" yOffset={-1}>
          <Knob value={masterVolume} onChange={actions.setMasterVolume} />
        </UpperLabel>
      </div>
    </div>
  );
};
