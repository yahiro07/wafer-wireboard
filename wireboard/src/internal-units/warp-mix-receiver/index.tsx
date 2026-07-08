import { ReactUnitTemplateFn } from "wafer-host/react";

export const createWarpMixReceiverUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  unitInterface.createAdditionalAudioInputNode("auxInput", "aux in");
  unitInterface.createAdditionalAudioOutputNode("auxOutput", "aux out");
  unitInterface.completeSetup({
    unitAspects: {
      unitType: "effect",
      categoryHint: "visualizer",
      outputs: ["audio"],
      inputs: ["audio"],
    },
  });
  return {
    RenderUi() {
      return (
        <div className="w-[300px] h-[160px] bg-white p-1">
          <div>warp mix receiver</div>
        </div>
      );
    },
  };
};
