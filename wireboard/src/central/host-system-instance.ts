import { createHostSystem } from "wafer-host/core";

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);
