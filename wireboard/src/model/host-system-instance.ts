import { createHostSystem } from "wafer-host/core";
import { createCustomSequencerTickDriver } from "@/host-extension-modules/custom-sequencer-tick-driver";

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);
export const sequencerTickDriver = createCustomSequencerTickDriver(hostSystem);
