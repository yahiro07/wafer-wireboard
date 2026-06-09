import { ReactUnitTemplateFn } from "wus-host/react";

export const createUnit1: ReactUnitTemplateFn = (unitInterface) => {
  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      outputs: ["note"],
      inputs: ["note"],
    },
    primaryInputPortHandlers: {
      noteInput: {
        noteOn(note, timeAt, velocity) {
          unitInterface.primaryOutputPort.noteOutput.noteOn(
            note,
            timeAt,
            velocity,
          );
        },
        noteOff(note, timeAt) {
          unitInterface.primaryOutputPort.noteOutput.noteOff(note, timeAt);
        },
      },
    },
  });
  return {
    RenderUi() {
      return (
        <div className="w-[400px] h-[200px] bg-gray-200 p-2">unit1 hello</div>
      );
    },
  };
};
