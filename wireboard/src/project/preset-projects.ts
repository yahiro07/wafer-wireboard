import { createWireItem } from "@/model/factory";
import { StoreState } from "@/model/store";
import { UnitItem, WireItem } from "@/model/types";

function extractPresetUnitItems(source: (UnitItem & { destSpec?: string })[]): {
  unitItems: UnitItem[];
  wireItems: WireItem[];
} {
  const unitItems = source.map((item) => ({
    unitId: item.unitId,
    catalogKey: item.catalogKey,
    position: item.position,
  }));
  const wireItems = source
    .filter((item) => item.destSpec)
    .map((item) => {
      const sourcePortId = item
        .destSpec!.split(".")[1]
        .replace("Input", "Output");
      const sourcePortKey = `${item.unitId}.${sourcePortId}`;
      return createWireItem(sourcePortKey, item.destSpec!);
    });
  return { unitItems, wireItems };
}

export function createPresetProjectsModel() {
  return {
    buildDefaultProjectStates(): Partial<StoreState> {
      const baseX = 4600;
      const baseY = 2650;
      const { unitItems, wireItems } = extractPresetUnitItems([
        {
          destSpec: "$output.audioInput",
          unitId: "builtInPreOutput",
          catalogKey: "builtInVisualizer",
          position: { x: baseX, y: baseY + 50 },
        },
        {
          destSpec: "builtInPreOutput.audioInput",
          unitId: "synth1",
          catalogKey: "miniSynthGe",
          position: { x: baseX, y: baseY + 350 },
        },
        {
          destSpec: "synth1.noteInput",
          unitId: "builtInKeyboard",
          catalogKey: "builtInKeyboard",
          position: { x: baseX, y: baseY + 650 },
        },
      ]);
      return {
        unitItems,
        wireItems,
        sight: { eyeScaling: 1.0, eyeOffset: { x: 0, y: 0 } },
      };
    },
    buildBlankProjectStates(): Partial<StoreState> {
      const baseX = 4600;
      const baseY = 2650;
      const { unitItems, wireItems } = extractPresetUnitItems([
        {
          destSpec: "$output.audioInput",
          unitId: "builtInPreOutput",
          catalogKey: "builtInVisualizer",
          position: { x: baseX, y: baseY + 50 },
        },
        {
          unitId: "builtInKeyboard",
          catalogKey: "builtInKeyboard",
          position: { x: baseX, y: baseY + 650 },
        },
      ]);
      return {
        unitItems,
        wireItems,
        sight: { eyeScaling: 1.0, eyeOffset: { x: 0, y: 0 } },
      };
    },
    buildDemoProjectStates(): Partial<StoreState> {
      const baseX = 4600;
      const baseY = 2650;
      const { unitItems, wireItems } = extractPresetUnitItems([
        {
          destSpec: "$output.audioInput",
          unitId: "builtInPreOutput",
          catalogKey: "builtInVisualizer",
          position: { x: baseX, y: baseY - 100 },
        },
        {
          destSpec: "builtInPreOutput.audioInput",
          unitId: "effect1",
          catalogKey: "sunsetDelay",
          position: { x: baseX + 250, y: baseY + 120 },
        },
        {
          destSpec: "effect1.audioInput",
          unitId: "synth1",
          catalogKey: "protoEnginePdFm",
          position: { x: baseX + 250, y: baseY + 400 },
        },
        {
          destSpec: "builtInPreOutput.audioInput",
          unitId: "drum1",
          catalogKey: "graphiteDrumMachine",
          position: { x: baseX - 250, y: baseY + 250 },
        },
        {
          destSpec: "synth1.noteInput",
          unitId: "builtInKeyboard",
          catalogKey: "builtInKeyboard",
          position: { x: baseX + 250, y: baseY + 650 },
        },
      ]);
      return {
        unitItems,
        wireItems,
        sight: { eyeScaling: 0.8, eyeOffset: { x: 0, y: 0 } },
      };
    },
  };
}
