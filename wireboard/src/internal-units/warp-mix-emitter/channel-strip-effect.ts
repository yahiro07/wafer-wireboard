import { UnitInterface } from "wafer-host/unit-types";
import { dispatchPartialAttrs } from "@/auxiliaries/object-dispatcher";
import {
  mapVolumeCurve,
  mapVolumeCurveCenterUnity,
} from "@/auxiliaries/volume-curve";

export const channelStripEffectConfigs = {
  faderPivot: 0.7,
};

const eqGainRange = 18;
const stereoSpreadMaxDelayTime = 0.018;
const stereoSpreadMaxWetGain = 0.45;
const stereoSpreadMaxDryReduction = 0.15;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mapEqGain(value: number) {
  return (clamp(value, 0, 1) - 0.5) * eqGainRange * 2;
}

function setAudioParam(
  param: AudioParam,
  value: number,
  audioContext: AudioContext,
) {
  param.setTargetAtTime(value, audioContext.currentTime, 0.01);
}

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

export function createChannelStripEffectEngine(unitInterface: UnitInterface) {
  const { audioContext } = unitInterface;
  const mainOutputNode = unitInterface.audioOutputNode;
  const auxOutputNode = unitInterface.createAdditionalAudioOutputNode(
    "auxOutput",
    "aux out",
  );
  const mainGain = audioContext.createGain();
  const auxGain = audioContext.createGain();
  const eqLowFilter = audioContext.createBiquadFilter();
  const eqMidFilter = audioContext.createBiquadFilter();
  const eqHighFilter = audioContext.createBiquadFilter();
  const stereoDryGain = audioContext.createGain();
  const stereoWetGain = audioContext.createGain();
  const stereoLeftDelay = audioContext.createDelay(stereoSpreadMaxDelayTime);
  const stereoRightDelay = audioContext.createDelay(stereoSpreadMaxDelayTime);
  const stereoMerger = audioContext.createChannelMerger(2);
  const panNode = audioContext.createStereoPanner();
  const inputNode = unitInterface.audioInputNode;

  eqLowFilter.type = "lowshelf";
  eqLowFilter.frequency.value = 180;
  eqMidFilter.type = "peaking";
  eqMidFilter.frequency.value = 1000;
  eqMidFilter.Q.value = 1;
  eqHighFilter.type = "highshelf";
  eqHighFilter.frequency.value = 6000;
  stereoDryGain.gain.value = 1;
  stereoWetGain.gain.value = 0;
  stereoLeftDelay.delayTime.value = 0;
  stereoRightDelay.delayTime.value = 0;

  inputNode.connect(eqLowFilter);
  eqLowFilter.connect(eqMidFilter);
  eqMidFilter.connect(eqHighFilter);
  eqHighFilter.connect(stereoDryGain);
  stereoDryGain.connect(panNode);
  eqHighFilter.connect(stereoLeftDelay);
  eqHighFilter.connect(stereoRightDelay);
  stereoLeftDelay.connect(stereoMerger, 0, 0);
  stereoRightDelay.connect(stereoMerger, 0, 1);
  stereoMerger.connect(stereoWetGain);
  stereoWetGain.connect(panNode);
  panNode.connect(mainGain);
  mainGain.connect(mainOutputNode);
  panNode.connect(auxGain);
  auxGain.connect(auxOutputNode);

  const state = {
    outputEnabled: true,
    mainGain: 1,
    auxGain: 0,
    faderGain: 1,
  };

  const internal = {
    affectGains() {
      const m = state.outputEnabled ? 1 : 0;
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
    pan(v: number) {
      setAudioParam(panNode.pan, clamp(v, -1, 1), audioContext);
    },
    eqLow(v: number) {
      setAudioParam(eqLowFilter.gain, mapEqGain(v), audioContext);
    },
    eqMid(v: number) {
      setAudioParam(eqMidFilter.gain, mapEqGain(v), audioContext);
    },
    eqHigh(v: number) {
      setAudioParam(eqHighFilter.gain, mapEqGain(v), audioContext);
    },
    stereoSpread(v: number) {
      const spread = clamp(v, 0, 1);
      setAudioParam(
        stereoDryGain.gain,
        1 - spread * stereoSpreadMaxDryReduction,
        audioContext,
      );
      setAudioParam(
        stereoWetGain.gain,
        spread * stereoSpreadMaxWetGain,
        audioContext,
      );
      setAudioParam(
        stereoRightDelay.delayTime,
        spread * stereoSpreadMaxDelayTime,
        audioContext,
      );
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
    cleanup() {
      inputNode.disconnect(eqLowFilter);
      eqLowFilter.disconnect(eqMidFilter);
      eqMidFilter.disconnect(eqHighFilter);
      eqHighFilter.disconnect(stereoDryGain);
      stereoDryGain.disconnect(panNode);
      eqHighFilter.disconnect(stereoLeftDelay);
      eqHighFilter.disconnect(stereoRightDelay);
      stereoLeftDelay.disconnect(stereoMerger);
      stereoRightDelay.disconnect(stereoMerger);
      stereoMerger.disconnect(stereoWetGain);
      stereoWetGain.disconnect(panNode);
      panNode.disconnect(mainGain);
      mainGain.disconnect(mainOutputNode);
      panNode.disconnect(auxGain);
      auxGain.disconnect(auxOutputNode);
    },
  };
}
