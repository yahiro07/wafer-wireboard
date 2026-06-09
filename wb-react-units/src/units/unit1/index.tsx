import { ReactUnitTemplateFn } from "wus-host/react";

export const createUnit1: ReactUnitTemplateFn = (unitInterface) => {
  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
    },
  });
  return {
    RenderUi() {
      return <div className="w-[200px] h-[100px] bd-red">unit1 hello</div>;
    },
  };
};
