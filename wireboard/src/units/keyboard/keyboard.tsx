import { clampValue } from "mofur/ax";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wus-host/react";
import {
  KeyboardOctaveBlock,
  KeyboardTopKey,
} from "@/units/keyboard/keyboard-block";
import { OctaveShifter } from "./octave-shifter";

export const createBuiltinKeyboardUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const { primaryOutputPort } = unitInterface;
  const { noteOutput } = primaryOutputPort;

  const store = createStore({
    notes: [] as number[],
    octave: 0, //-2~+2
  });

  primaryOutputPort.setCallbacks({
    onDisconnectTo() {
      store.setState({ notes: [] });
    },
  });

  const actions = {
    async noteOn(noteNumber: number) {
      store.setNotes((prev) => [...prev, noteNumber]);
      noteOutput.noteOn(noteNumber);
    },
    noteOff(noteNumber: number) {
      store.setNotes((prev) => prev.filter((n) => n !== noteNumber));
      noteOutput.noteOff(noteNumber);
    },
    shiftOctave(dir: number) {
      const newOctave = clampValue(store.state.octave + dir, -2, 2);
      store.setOctave(newOctave);
    },
  };

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      categoryHint: "keyboard",
      outputs: ["note"],
      inputs: ["note"],
    },
    primaryInputPortHandlers: {
      noteInput: {
        noteOn: actions.noteOn,
        noteOff: actions.noteOff,
      },
    },
  });

  return {
    RenderUi() {
      const { notes, octave } = store.useSnapshot();
      return (
        <div className="w-full h-full flex-c px-1">
          <div className="flex-v gap-1">
            <OctaveShifter octave={octave} shiftOctave={actions.shiftOctave} />
            <div className="flex-h">
              <KeyboardOctaveBlock
                baseNoteNumber={48}
                activeNotes={notes}
                noteOn={actions.noteOn}
                noteOff={actions.noteOff}
              />
              <KeyboardOctaveBlock
                baseNoteNumber={60}
                activeNotes={notes}
                noteOn={actions.noteOn}
                noteOff={actions.noteOff}
              />
              <KeyboardTopKey
                noteNumber={72}
                activeNotes={notes}
                noteOn={actions.noteOn}
                noteOff={actions.noteOff}
              />
            </div>
          </div>
        </div>
      );
    },
  };
};
