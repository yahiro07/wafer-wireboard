import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { NotesPatternCell } from "@/internal-units/note-hub/notes-pattern-cell";
import { hmrActions } from "@/periphery/hmr-handler";

export const createNoteHubUnit: ReactUnitTemplateFn = (unitInterface) => {
  const noteOutputPort = unitInterface.createNoteOutputPort();
  const ac = unitInterface.audioContext;

  const store = createStore<{ notes: number[] }>({
    notes: [],
  });
  function scheduleAction(time: number, fn: () => void) {
    const waitTime = Math.max(time ?? 0, ac.currentTime) - ac.currentTime;
    if (waitTime <= 0) {
      fn();
    } else {
      setTimeout(fn, waitTime * 1000);
    }
  }
  const actions = {
    noteOn(note: number, time: number, vel: number) {
      noteOutputPort.noteOn(note, time, vel);
      scheduleAction(time, () => {
        store.setNotes((prev) => [...prev, note]);
      });
    },
    noteOff(note: number, time: number) {
      noteOutputPort.noteOff(note, time);
      scheduleAction(time, () => {
        store.setNotes((prev) => prev.filter((n) => n !== note));
      });
    },
  };
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
    noteInput: {
      noteOn: actions.noteOn,
      noteOff: actions.noteOff,
    },
  });

  return {
    RenderUi() {
      const { notes } = store.useSnapshot();
      const latestNote = notes[notes.length - 1];
      return (
        <div className="w-full h-full bg-white flex-c text-[#555]">
          <div className="w-[64px] h-[64px] flex-vc gap-1">
            <div className="text-xs">note hub</div>
            <div className="flex-h gap-1">
              <NotesPatternCell notes={notes} />
              <div className="w-[20px] text-xs bd-gray-400 flex-c">
                {latestNote}
              </div>
            </div>
          </div>
        </div>
      );
    },
  };
};

import.meta.hot?.on("vite:afterUpdate", () => {
  hmrActions.handleUnitSourceUpdate("builtInNoteHub");
});
