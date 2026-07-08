import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInterface } from "wafer-host/unit-types";
import { mapVolumeCurveCenterUnity } from "@/auxiliaries/volume-curve";
import { Knob } from "@/components/knob";
import { UpperLabel } from "@/components/upper-label";

type EffectParameters = {
  mainVolume: number;
  auxVolume: number;
};

function createEngine(unitInterface: UnitInterface) {
  const { audioContext } = unitInterface;
  const mainOutputNode = unitInterface.audioOutputNode;
  const auxOutputNode = unitInterface.createAdditionalAudioOutputNode(
    "auxOutput",
    "aux out",
  );
  const mainGain = audioContext.createGain();
  const auxGain = audioContext.createGain();
  const mainInputNode = unitInterface.audioInputNode;
  const auxInputNode = unitInterface.createAdditionalAudioInputNode(
    "auxInput",
    "aux in",
  );

  mainInputNode.connect(mainGain);
  mainGain.connect(mainOutputNode);
  auxInputNode.connect(auxGain);
  auxGain.connect(auxOutputNode);
  return {
    applyParameters(attrs: Partial<EffectParameters>) {
      if (attrs.mainVolume !== undefined) {
        const gain = mapVolumeCurveCenterUnity(attrs.mainVolume);
        mainGain.gain.value = gain;
      }
      if (attrs.auxVolume !== undefined) {
        const gain = mapVolumeCurveCenterUnity(attrs.auxVolume);
        auxGain.gain.value = gain;
      }
    },
    cleanup() {
      mainInputNode.disconnect(mainGain);
      mainGain.disconnect(mainOutputNode);
      auxInputNode.disconnect(auxGain);
      auxGain.disconnect(auxOutputNode);
    },
  };
}

export const createWarpMixReceiverUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const engine = createEngine(unitInterface);

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "effect",
      outputs: ["audio"],
      inputs: ["audio"],
    },
    cleanup: engine.cleanup,
  });

  const defaultParameters: EffectParameters = {
    mainVolume: 0.5,
    auxVolume: 0.5,
  };
  engine.applyParameters(defaultParameters);

  const store = createStore<EffectParameters>(defaultParameters);
  const actions = {
    setParameter<K extends keyof EffectParameters>(
      key: K,
      value: EffectParameters[K],
    ) {
      engine.applyParameters({ [key]: value });
      store.assign({ [key]: value });
    },
  };

  return {
    RenderUi() {
      const st = store.useSnapshot();
      return (
        <div className="w-[300px] h-[160px] bg-white p-1">
          <div className="flex-v h-full">
            <div>warp mix receiver</div>
            <div className="grow flex-c gap-8">
              <UpperLabel label="aux" textColor="#444">
                <Knob
                  value={st.auxVolume}
                  onChange={(v) => actions.setParameter("auxVolume", v)}
                />
              </UpperLabel>
              <UpperLabel label="main" textColor="#444">
                <Knob
                  value={st.mainVolume}
                  onChange={(v) => actions.setParameter("mainVolume", v)}
                />
              </UpperLabel>
            </div>
          </div>
        </div>
      );
    },
  };
};
