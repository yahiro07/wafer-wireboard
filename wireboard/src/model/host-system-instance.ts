import { createHostSystem, createSequencerTickDriver } from "wafer-host/core";

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);
export const sequencerTickDriver = createSequencerTickDriver(hostSystem);
