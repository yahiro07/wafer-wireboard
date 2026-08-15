import { setupMidiKeyboardInput } from "@/auxiliaries/midi-keyboard-input";
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
