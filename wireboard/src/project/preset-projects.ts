import { createWireItem } from "@/model/factory";
import { StoreState } from "@/model/store";
import { UnitItem, WireItem } from "@/model/types";

function extractPresetUnitItems(
  source: (UnitItem & { destUnitId?: string })[],
): {
  unitItems: UnitItem[];
  wireItems: WireItem[];
} {
  const unitItems = source.map((item) => ({
    unitId: item.unitId,
    catalogKey: item.catalogKey,
    internalUnitKey: item.internalUnitKey,
    position: item.position,
  }));
  const wireItems = source
    .filter((item) => item.destUnitId)
    .map((item) => {
      const sourcePortKey = `${item.unitId}.primaryOutput`;
      const destinationPortKey = `${item.destUnitId}.primaryInput`;
      return createWireItem(sourcePortKey, destinationPortKey);
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
          destUnitId: "$output",
          unitId: "builtInPreOutput",
          internalUnitKey: "builtInVisualizer",
          position: { x: baseX, y: baseY + 50 },
        },
        {
          destUnitId: "builtInPreOutput",
          unitId: "unit1",
          catalogKey: "miniSynthGe",
          position: { x: baseX, y: baseY + 350 },
        },
        {
          destUnitId: "unit1",
          unitId: "builtInKeyboard",
          internalUnitKey: "builtInKeyboard",
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
          destUnitId: "$output",
          unitId: "builtInPreOutput",
          internalUnitKey: "builtInVisualizer",
          position: { x: baseX, y: baseY + 50 },
        },
        {
          unitId: "builtInKeyboard",
          internalUnitKey: "builtInKeyboard",
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
          destUnitId: "$output",
          unitId: "builtInPreOutput",
          internalUnitKey: "builtInVisualizer",
          position: { x: baseX, y: baseY - 100 },
        },
        {
          destUnitId: "builtInPreOutput",
          unitId: "unit1",
          catalogKey: "sunsetDelay",
          position: { x: baseX + 250, y: baseY + 120 },
        },
        {
          destUnitId: "unit1",
          unitId: "unit2",
          catalogKey: "protoEnginePdFm",
          position: { x: baseX + 250, y: baseY + 400 },
        },
        {
          destUnitId: "builtInPreOutput",
          unitId: "unit3",
          catalogKey: "myDrumMachine",
          position: { x: baseX - 250, y: baseY + 250 },
        },
        {
          destUnitId: "unit2",
          unitId: "builtInKeyboard",
          internalUnitKey: "builtInKeyboard",
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
