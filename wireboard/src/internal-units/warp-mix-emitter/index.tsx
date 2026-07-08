import { createEventPort } from "mofur/mo";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInterface } from "wafer-host/unit-types";
import { dispatchPartialAttrs } from "@/auxiliaries/object-dispatcher";
import {
  mapVolumeCurve,
  mapVolumeCurveCenterUnity,
} from "@/auxiliaries/volume-curve";
import { Button } from "@/components/button";
import { UpperLabel } from "@/components/upper-label";
import { FdKnob } from "@/internal-units/warp-mix-emitter/knob";
import { ParameterGauge } from "@/internal-units/warp-mix-emitter/parameter-gauge";

type EffectParameters = {
  mainVolume: number;
  auxVolume: number;
  faderVolume: number;
  pan: number;
  eqLow: number;
  eqMid: number;
  eqHigh: number;
  stereoSpread: number;
  outputEnabled: boolean;
};

type ChannelStripState = EffectParameters & {
  outputSolo: boolean;
  localPlaying: boolean;
};

function createChannelStripState(): ChannelStripState {
  return {
    mainVolume: 0.5,
    auxVolume: 0,
    faderVolume: configs.faderPivot,
    pan: 0,
    eqLow: 0.5,
    eqMid: 0.5,
    eqHigh: 0.5,
    stereoSpread: 0,
    outputEnabled: true,
    //
    outputSolo: false,
    localPlaying: false,
  };
}

const configs = {
  faderPivot: 0.7,
};

type SoloOwnership = "own" | "other" | "none";

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
    mainGain: 1,
    auxGain: 0,
    faderGain: 1,
    soloOwnership: "none",
  };

  const internal = {
    affectGains() {
      const m =
        state.soloOwnership === "own" ||
        (state.outputEnabled && state.soloOwnership !== "other")
          ? 1
          : 0;
      mainGain.gain.value = state.faderGain * state.mainGain * m;
      auxGain.gain.value = state.faderGain * state.auxGain * m;
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
    faderVolume(v: number) {
      state.faderGain = mapVolumeCurve(v, {
        pivot: configs.faderPivot,
        topGain: 2,
        lowerCurveExponent: 2,
      });
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
    setSoloOwnership(v: SoloOwnership) {
      state.soloOwnership = v;
      internal.affectGains();
    },
    cleanup() {
      inputNode.disconnect(mainGain);
      mainGain.disconnect(mainOutputNode);
      inputNode.disconnect(auxGain);
      auxGain.disconnect(auxOutputNode);
    },
  };
}

const sharedEventPort = createEventPort<
  | {
      type: "soloChanged";
      activeSoloInstanceId: number | null;
    }
  | {
      type: "localPlayingChanged";
      activeLocalPlayingInstanceId: number | null;
    }
>();
let instanceIdCounter = 0;

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

  const initialState = createChannelStripState();
  engine.applyParameters(initialState);

  const selfInstanceId = instanceIdCounter++;

  const store = createStore<ChannelStripState>(initialState);
  const actions = {
    setParameter<K extends keyof EffectParameters>(
      key: K,
      value: EffectParameters[K],
    ) {
      engine.applyParameters({ [key]: value });
      store.assign({ [key]: value });
    },
  };

  function setupSoloExclusion() {
    return sharedEventPort.subscribe((event) => {
      if (event.type === "soloChanged") {
        const soloOwnership =
          event.activeSoloInstanceId === selfInstanceId
            ? "own"
            : event.activeSoloInstanceId !== null
              ? "other"
              : "none";
        store.setOutputSolo(soloOwnership === "own");
        engine.setSoloOwnership(soloOwnership);
      }
      if (event.type === "localPlayingChanged") {
        store.setLocalPlaying(
          event.activeLocalPlayingInstanceId === selfInstanceId,
        );
      }
    });
  }

  function wrapToggleLocalPlaying() {
    const nextLocalPlaying = !store.state.localPlaying;
    unitInterface.sendMessageToHost({
      type: "partialPlaybackRequest",
      playing: nextLocalPlaying,
    });
    sharedEventPort.emit({
      type: "localPlayingChanged",
      activeLocalPlayingInstanceId: nextLocalPlaying ? selfInstanceId : null,
    });
  }

  function wrapToggleOutputSolo() {
    const nextSelfSolo = !store.state.outputSolo;
    sharedEventPort.emit({
      type: "soloChanged",
      activeSoloInstanceId: nextSelfSolo ? selfInstanceId : null,
    });
  }

  return {
    RenderUi() {
      const st = store.useSnapshot();
      // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
      useEffect(setupSoloExclusion, []);

      const panelMainContent = (
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
                    onClick={wrapToggleOutputSolo}
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
                  <UpperLabel label="main">
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
                    onClick={wrapToggleLocalPlaying}
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
      );
      const extraFaderPart = (
        <div className="absolute top-0 right-[-92px] z-100">
          <ParameterGauge
            value={st.faderVolume}
            onChange={(v) => actions.setParameter("faderVolume", v)}
          />
        </div>
      );
      return (
        <div className="relative w-[300px] h-[160px] bg-indigo-200 p-1">
          {panelMainContent}
          {extraFaderPart}
        </div>
      );
    },
  };
};
