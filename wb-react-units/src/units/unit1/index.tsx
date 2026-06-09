import { ReactUnitTemplateFn } from "wus-host/react";

export const createUnit1: ReactUnitTemplateFn = (unitInterface) => {
  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
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
