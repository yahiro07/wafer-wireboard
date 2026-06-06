import { ReactUnitTemplateFn } from "wus-host/react";

export const createBuiltinKeyboardUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const audioContext = unitInterface.audioContext;
  const outputPort = unitInterface.primaryOutputPort;
  const activeNotes = new Set<number>();

  outputPort.setCallbacks({
    onDisconnectTo() {
      activeNotes.clear();
    },
  });

  const actions = {
    async noteOn(note: number) {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
        console.log("resumed");
      }
      outputPort.noteOutput.noteOn(note);
    },
    noteOff(note: number) {
      outputPort.noteOutput.noteOff(note);
    },
  };

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      categoryHint: "keyboard",
      outputs: ["note"],
    },
  });

  return {
    RenderUi() {
      return (
        <div className="w-[200px] h-[100px] flex-c gap-2">
          <button
            type="button"
            onPointerDown={() => actions.noteOn(57)}
            onPointerUp={() => actions.noteOff(57)}
            className="cursor-pointer bg-gray-200 px-4 py-2"
          >
            A
          </button>
          <button
            type="button"
            onPointerDown={() => actions.noteOn(60)}
            onPointerUp={() => actions.noteOff(60)}
            className="cursor-pointer bg-gray-200 px-4 py-2"
          >
            C
          </button>
        </div>
      );
    },
  };
};
