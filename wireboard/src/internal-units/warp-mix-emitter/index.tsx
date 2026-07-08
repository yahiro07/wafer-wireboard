import { ReactUnitTemplateFn } from "wafer-host/react";

export const createWarpMixEmitterUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const mainOutputNode = unitInterface.audioOutputNode;
  const auxOutputNode = unitInterface.createAdditionalAudioOutputNode(
    "auxOutput",
    "aux out",
  );
  const inputNode = unitInterface.audioInputNode;

  inputNode.connect(mainOutputNode);
  inputNode.connect(auxOutputNode);

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "effect",
      categoryHint: "visualizer",
      outputs: ["audio"],
      inputs: ["audio"],
    },
    cleanup() {
      inputNode.disconnect(mainOutputNode);
      inputNode.disconnect(auxOutputNode);
    },
  });
  return {
    RenderUi() {
      return (
        <div className="w-[300px] h-[160px] bg-white p-1">
          <div>warp mix emitter</div>
        </div>
      );
    },
  };
};
