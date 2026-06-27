import { useMemo } from "react";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { KeyboardOctaveBlock, KeyboardTopKey } from "./keyboard-block";
import { OctaveShifter } from "./octave-shifter";

export const createBuiltinKeyboardUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const noteOutput = unitInterface.noteOutputPort;

  const notesMap = new Map<number, number>(); // key: noteKey, value: noteNumber

  const store = createStore({
    notes: [] as number[],
    octave: 0, //-2~+2
  });

  // noteOutput.setCallbacks({
  //   onDisconnectTo() {
  //     store.setState({ notes: [] });
  //   },
  // });

  const actions = {
    async noteOn(noteKey: number) {
      const noteNumber = noteKey + store.state.octave * 12;
      store.setNotes((prev) => [...prev, noteNumber]);
      noteOutput.noteOn(noteNumber);
      notesMap.set(noteKey, noteNumber);
    },
    noteOff(noteKey: number) {
      const noteNumber = notesMap.get(noteKey);
      if (noteNumber) {
        store.setNotes((prev) => prev.filter((n) => n !== noteNumber));
        noteOutput.noteOff(noteNumber);
        notesMap.delete(noteKey);
      }
    },
    setOctave(octave: number) {
      store.setOctave(octave);
    },
  };

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      categoryHint: "keyboard",
      outputs: ["note"],
      inputs: ["note"],
    },
    noteInput: {
      noteOn: actions.noteOn,
      noteOff: actions.noteOff,
    },
  });

  return {
    RenderUi() {
      const { notes, octave } = store.useSnapshot();
      const activeNotes = useMemo(() => {
        return notes.map((noteNumber) => noteNumber - octave * 12);
      }, [notes, octave]);
      return (
        <div className="w-full h-full flex-c px-1">
          <div className="flex-v gap-1">
            <OctaveShifter octave={octave} setOctave={actions.setOctave} />
            <div className="flex-h">
              <KeyboardOctaveBlock
                baseNoteNumber={48}
                activeNotes={activeNotes}
                noteOn={actions.noteOn}
                noteOff={actions.noteOff}
              />
              <KeyboardOctaveBlock
                baseNoteNumber={60}
                activeNotes={activeNotes}
                noteOn={actions.noteOn}
                noteOff={actions.noteOff}
              />
              <KeyboardTopKey
                noteNumber={72}
                activeNotes={activeNotes}
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
