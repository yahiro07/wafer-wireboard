import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { NotesPatternCell } from "@/internal-units/note-hub/notes-pattern-cell";
import { hmrActions } from "@/periphery/hmr-handler";

export const createNoteHubUnit: ReactUnitTemplateFn = (unitInterface) => {
  const noteOutputPort = unitInterface.createNoteOutputPort();

  const store = createStore<{ notes: number[] }>({
    notes: [],
  });
  const actions = {
    noteOn(note: number, time: number, vel: number) {
      store.setNotes((prev) => [...prev, note]);
      noteOutputPort.noteOn(note, time, vel);
    },
    noteOff(note: number, time: number) {
      store.setNotes((prev) => prev.filter((n) => n !== note));
      noteOutputPort.noteOff(note, time);
    },
  };
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    noteInput: {
      noteOn: actions.noteOn,
      noteOff: actions.noteOff,
      setProgressionRootNote(note: number, time: number) {
        noteOutputPort.setProgressionRootNote(note, time);
      },
    },
  });

  return {
    RenderUi() {
      const { notes } = store.useSnapshot();
      return (
        <div className="w-full h-full bg-white flex-c text-[#555]">
          <div className="w-[64px] h-[64px] flex-vc gap-1">
            <div className="text-sm">note hub</div>
            <NotesPatternCell notes={notes} />
          </div>
        </div>
      );
    },
  };
};

import.meta.hot?.on("vite:afterUpdate", () => {
  hmrActions.handleUnitSourceUpdate("builtInNoteHub");
});
