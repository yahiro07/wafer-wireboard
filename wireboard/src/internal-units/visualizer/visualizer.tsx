import { useEffect, useRef } from "react";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { renderSpectrum } from "./spectrum-renderer";

export const createBuiltinVisualizerUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const audioContext = unitInterface.audioContext;
  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 1024;
  unitInterface.audioInputNode.connect(analyzer);
  analyzer.connect(unitInterface.audioOutputNode);

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "effect",
      categoryHint: "visualizer",
      outputs: ["audio"],
      inputs: ["audio"],
    },
  });

  function setupCanvas(canvas: HTMLCanvasElement) {
    let running = true;

    const getFftLevels = () => {
      const levels = new Float32Array(analyzer.frequencyBinCount);
      analyzer.getFloatFrequencyData(levels);
      return levels;
    };

    const renderLoop = () => {
      const levels = getFftLevels();
      renderSpectrum(canvas, levels);
      if (running) {
        requestAnimationFrame(renderLoop);
      }
    };
    requestAnimationFrame(renderLoop);

    return () => {
      running = false;
    };
  }

  return {
    RenderUi() {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      // biome-ignore lint/correctness/useExhaustiveDependencies: off
      useEffect(() => {
        return setupCanvas(canvasRef.current!);
      }, []);
      return (
        <div className="w-full h-full bg-black p-1">
          <canvas ref={canvasRef} className="w-[125px] h-[50px]" />
        </div>
      );
    },
  };
};
