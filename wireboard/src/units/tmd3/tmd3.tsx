import { ReactUnitTemplateFn } from "wus-host/react";

export const createTmd3Unit: ReactUnitTemplateFn = (unitInterface) => {
  const noteOutput = unitInterface.primaryOutputPort.noteOutput;
  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      inputs: ["clock", "note"],
    },
    primaryInputPortHandlers: {
      noteInput: {
        noteOn(note, timeAt, velocity) {
          noteOutput.noteOn(note, timeAt, velocity);
        },
        noteOff(note, timeAt) {
          noteOutput.noteOff(note, timeAt);
        },
      },
    },
  });

  return {
    RenderUi() {
      return <div>tmd3</div>;
    },
  };
};
