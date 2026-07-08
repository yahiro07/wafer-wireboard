import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInterface } from "wafer-host/unit-types";
import { dispatchPartialAttrs } from "@/auxiliaries/object-dispatcher";
import { mapVolumeCurveCenterUnity } from "@/auxiliaries/volume-curve";
import { Button } from "@/components/button";
import { UpperLabel } from "@/components/upper-label";
import { FdKnob } from "@/internal-units/warp-mix-emitter/knob";

type EffectParameters = {
  mainVolume: number;
  auxVolume: number;
  pan: number;
  eqLow: number;
  eqMid: number;
  eqHigh: number;
  stereoSpread: number;
  outputEnabled: boolean;
  outputSolo: boolean;
  localPlaying: boolean;
};

const defaultEffectParameters: EffectParameters = {
  mainVolume: 0.5,
  auxVolume: 0,
  pan: 0,
  eqLow: 0.5,
  eqMid: 0.5,
  eqHigh: 0.5,
  stereoSpread: 0,
  outputEnabled: true,
  outputSolo: false,
  localPlaying: false,
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
  const inputNode = unitInterface.audioInputNode;

  inputNode.connect(mainGain);
  mainGain.connect(mainOutputNode);
  inputNode.connect(auxGain);
  auxGain.connect(auxOutputNode);

  const state = {
    outputEnabled: true,
    mainGain: 0.5,
    auxGain: 0,
  };

  const internal = {
    affectGains() {
      const m = state.outputEnabled ? 1 : 0;
      mainGain.gain.value = state.mainGain * m;
      auxGain.gain.value = state.auxGain * m;
    },
  };

  const setterFns = {
    mainVolume(v: number) {
      state.mainGain = mapVolumeCurveCenterUnity(v);
      internal.affectGains();
    },
    auxVolume(v: number) {
      state.auxGain = mapVolumeCurveCenterUnity(v);
      internal.affectGains();
    },
    outputEnabled(v: boolean) {
      state.outputEnabled = v;
      internal.affectGains();
    },
  };
  return {
    applyParameters(attrs: Partial<EffectParameters>) {
      dispatchPartialAttrs(attrs, setterFns);
    },
    cleanup() {
      inputNode.disconnect(mainGain);
      mainGain.disconnect(mainOutputNode);
      inputNode.disconnect(auxGain);
      auxGain.disconnect(auxOutputNode);
    },
  };
}

export const createWarpMixEmitterUnit: ReactUnitTemplateFn = (
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

  engine.applyParameters(defaultEffectParameters);

  const store = createStore<EffectParameters>(defaultEffectParameters);
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
        <div className="w-[300px] h-[160px] bg-indigo-200 p-1">
          <div className="flex-v h-full">
            <div className="grow flex-c text-[#444]">
              <div className="flex-v gap-3">
                <div>warp mix emitter</div>
                <div className="flex-v gap-6">
                  <div className="flex-ha gap-4">
                    <Button
                      asr={1.2}
                      text="on"
                      active={st.outputEnabled}
                      onClick={() =>
                        actions.setParameter("outputEnabled", !st.outputEnabled)
                      }
                    />
                    <Button
                      asr={1.2}
                      text="solo"
                      active={st.outputSolo}
                      onClick={() =>
                        actions.setParameter("outputSolo", !st.outputSolo)
                      }
                    />
                    <UpperLabel label="aux">
                      <FdKnob
                        value={st.auxVolume}
                        onChange={(v) => actions.setParameter("auxVolume", v)}
                      />
                    </UpperLabel>
                    <UpperLabel label="pan">
                      <FdKnob
                        value={st.pan}
                        min={-1}
                        max={1}
                        onChange={(v) => actions.setParameter("pan", v)}
                      />
                    </UpperLabel>
                    <UpperLabel label="vol">
                      <FdKnob
                        value={st.mainVolume}
                        onChange={(v) => actions.setParameter("mainVolume", v)}
                      />
                    </UpperLabel>
                  </div>
                  <div className="flex-ha justify-between">
                    <Button
                      asr={1.2}
                      text="play"
                      active={st.localPlaying}
                      onClick={() =>
                        actions.setParameter("localPlaying", !st.localPlaying)
                      }
                    />
                    <div className="flex-ha gap-4">
                      <UpperLabel label="stereo">
                        <FdKnob
                          value={st.stereoSpread}
                          onChange={(v) =>
                            actions.setParameter("stereoSpread", v)
                          }
                        />
                      </UpperLabel>
                      <UpperLabel label="low">
                        <FdKnob
                          value={st.eqLow}
                          onChange={(v) => actions.setParameter("eqLow", v)}
                        />
                      </UpperLabel>
                      <UpperLabel label="mid">
                        <FdKnob
                          value={st.eqMid}
                          onChange={(v) => actions.setParameter("eqMid", v)}
                        />
                      </UpperLabel>
                      <UpperLabel label="high">
                        <FdKnob
                          value={st.eqHigh}
                          onChange={(v) => actions.setParameter("eqHigh", v)}
                        />
                      </UpperLabel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  };
};
