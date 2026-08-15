import { Icons } from "@/common/icons";
import { Button } from "@/components/button";
import { IconButton } from "@/components/icon-button";
import { Knob } from "@/components/knob";
import { NumberSliderBox } from "@/components/number-slider-box";
import { UpperLabel } from "@/components/upper-label";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import { projectsModel } from "@/project/projects-model";

export const TopControlBar = () => {
  const { playing, bpm, masterVolume, wireVertical } = store.useSnapshot();
  return (
    <div className="flex-c px-4 gap-8 pt-3.5 pb-1 pointer-events-auto">
      <div className="flex-ha gap-2 text-white">
        <Button asr={1.5} active={playing} onClick={actions.togglePlayState}>
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
        <div className="flex-ha gap-2">
          <UpperLabel label="MASTER" yOffset={-1}>
            <Knob value={masterVolume} onChange={actions.setMasterVolume} />
          </UpperLabel>
        </div>
      </div>
      <div className="flex-ha gap-2">
        <Button text="Init" onClick={projectsModel.loadDefaultProject} />
        <Button text="Clear" onClick={projectsModel.loadBlankProject} />
        <IconButton
          small
          icon={Icons.BarsArrow}
          onClick={actions.toggleWireVertical}
          rotation={wireVertical ? 180 : 270}
        />
        <IconButton
          small
          icon={Icons.List}
          onClick={actions.toggleSecondControlBarVisible}
        />
      </div>
    </div>
  );
};
