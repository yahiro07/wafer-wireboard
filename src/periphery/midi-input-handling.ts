import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { hostSystem } from "@/model/host-system-instance";

export function setupMidiInputHandling() {
  const destUnitId = "builtInKeyboard";
  return setupMidiKeyboardInput({
    noteOn(noteNumber) {
      hostSystem.deliverNote({ destUnitId, noteNumber, isOn: true });
    },
    noteOff(noteNumber) {
      hostSystem.deliverNote({ destUnitId, noteNumber, isOn: false });
    },
  });
}
