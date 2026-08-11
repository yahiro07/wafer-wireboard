import { clampValue } from "mofur/ax";
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

  unitInterface.completeSetup({
    unitAspects: { unitType: "effect" },
    automationInput: {
      getParameterSpecs() {
        return [{ id: "volume" }];
      },
      getParameter(id) {
        if (id === "volume") {
          return store.state.volume;
        }
      },
      setParameter(id, value) {
        if (id === "volume") {
          actions.setVolume(value);
        }
      },
    },
    persistence: {
      emitStateBytes() {
        return new Uint8Array([Math.round(store.state.volume * 255)]);
      },
      applyStateBytes(stateBytes: Uint8Array) {
        if (stateBytes.length !== 1) return;
        const volume = clampValue(stateBytes[0] / 255, 0, 1);
        actions.setVolume(volume);
      },
    },
  });

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
