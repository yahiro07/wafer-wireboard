import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { mapVolumeCurveCenterUnity } from "@/auxiliaries/volume-curve";
import { Knob } from "@/components/knob";
import { UpperLabel } from "@/components/upper-label";
import { hmrActions } from "@/periphery/hmr-handler";

export const createVolumeUnit: ReactUnitTemplateFn = (unitInterface) => {
  const audioContext = unitInterface.audioContext;
  const gainNode = audioContext.createGain();
  unitInterface.audioInputNode.connect(gainNode);
  gainNode.connect(unitInterface.audioOutputNode);

  const applyVolumeToNode = (volume: number) => {
    gainNode.gain.value = mapVolumeCurveCenterUnity(volume);
  };

  unitInterface.completeSetup({
    unitAspects: { unitType: "effect", outputs: ["audio"], inputs: ["audio"] },
  });

  const store = createStore({
    volume: 0.5,
  });
  applyVolumeToNode(store.state.volume);

  const actions = {
    setVolume(volume: number) {
      store.setVolume(volume);
      applyVolumeToNode(volume);
    },
  };

  return {
    RenderUi() {
      const { volume } = store.useSnapshot();
      return (
        <div className="w-full h-full bg-white flex-c text-[#555]">
          <div className="w-[64px] h-[64px] flex-c pt-3">
            <UpperLabel label="volume" yOffset={-3}>
              <Knob value={volume} onChange={actions.setVolume} />
            </UpperLabel>
          </div>
        </div>
      );
    },
  };
};

import.meta.hot?.on("vite:afterUpdate", () => {
  hmrActions.handleUnitSourceUpdate("builtInVolume");
});
