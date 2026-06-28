import { createBuiltinKeyboardUnit } from "@/internal-units/keyboard/keyboard";
import { createBuiltinVisualizerUnit } from "@/internal-units/visualizer/visualizer";

export const internalUnitFunctions = {
  builtInKeyboard: createBuiltinKeyboardUnit,
  builtInVisualizer: createBuiltinVisualizerUnit,
};

export type InternalUnitKey = keyof typeof internalUnitFunctions;
