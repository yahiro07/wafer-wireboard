import { Icons, IconsEx } from "@/common/icons";
import { Button } from "@/components/button";
import { Knob } from "@/components/knob";
import { NumberSliderBox } from "@/components/number-slider-box";
import { UpperLabel } from "@/components/upper-label";
import { appConfig } from "@/main-definitions/app-config";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import { projectsModel } from "@/project/projects-model";

export const TopControlBar = () => {
  const { playing, bpm, masterVolume, sceneSwitcherVisible } =
    store.useSnapshot();
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

      <div className="flex-ha gap-1.5">
        <Button
          text="Default(debug)"
          onClick={projectsModel.loadDefaultProject}
        />
        <Button text="Clear" onClick={projectsModel.loadBlankProject} />
        <Button text="Demo" onClick={projectsModel.loadDemoProject} />
        <Button text="Import" onClick={projectsModel.importProject} />
        <Button text="Export" onClick={projectsModel.exportProject} />
        <Button text="wire-dir" onClick={() => store.toggleWireVertical()} />
      </div>
    </div>
  );
};
