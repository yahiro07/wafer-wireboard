import { createHostSystem } from "wus-host/host";

const audioContext = new AudioContext();
export const hostSystem = createHostSystem(audioContext);
