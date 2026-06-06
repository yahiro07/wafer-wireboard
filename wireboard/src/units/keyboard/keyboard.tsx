import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wus-host/react";
import {
  KeyboardOctaveBlock,
  KeyboardTopKey,
} from "@/units/keyboard/keyboard-block";

export const createBuiltinKeyboardUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const { primaryOutputPort } = unitInterface;
  const { noteOutput } = primaryOutputPort;

  const store = createStore({
    notes: [] as number[],
  });

  primaryOutputPort.setCallbacks({
    onDisconnectTo() {
      store.setState({ notes: [] });
    },
  });

  const actions = {
    async noteOn(noteNumber: number) {
      store.mutations.setNotes((prev) => [...prev, noteNumber]);
      noteOutput.noteOn(noteNumber);
    },
    noteOff(noteNumber: number) {
      store.mutations.setNotes((prev) => prev.filter((n) => n !== noteNumber));
      noteOutput.noteOff(noteNumber);
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
      const { notes } = store.useSnapshot();
      return (
        <div className="w-[200px] h-[100px] flex-c">
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
      );
    },
  };
};
