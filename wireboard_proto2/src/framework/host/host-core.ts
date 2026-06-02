import { HsUnitOutputPort } from "@/framework/host/host-types";
import { createHsUnitOutputPortImpl } from "@/framework/host/output-port";

const audioContext = new AudioContext();
export const gAudioContext = audioContext;

export function createHsUnitOutputPort(): HsUnitOutputPort {
  return createHsUnitOutputPortImpl(() => audioContext.createGain());
}
