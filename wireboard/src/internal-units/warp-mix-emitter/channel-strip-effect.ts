import { UnitInterface } from "wafer-host/unit-types";
import { dispatchPartialAttrs } from "@/auxiliaries/object-dispatcher";
import {
  mapVolumeCurve,
  mapVolumeCurveCenterUnity,
} from "@/auxiliaries/volume-curve";

export const channelStripEffectConfigs = {
  faderPivot: 0.7,
};

export type ChannelStripEffectParameters = {
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

export type SoloOwnership = "own" | "other" | "none";

export function createChannelStripEffectEngine(unitInterface: UnitInterface) {
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
        pivot: channelStripEffectConfigs.faderPivot,
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
    applyParameters(attrs: Partial<ChannelStripEffectParameters>) {
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
