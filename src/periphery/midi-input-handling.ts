import { setupMidiKeyboardInput } from "@/auxiliaries/midi-keyboard-input";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { useEffect } from "react";

export function useMidiInputHandling() {
  const { midiInEnabled } = store.useSnapshot();
  useEffect(() => {
    if (midiInEnabled) {
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
  }, [midiInEnabled]);
}
