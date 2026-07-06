import { appConfig } from "@/base/app-config";
import { createWireItem } from "@/model/factory";
import { store } from "@/model/store";
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

export function buildDefaultScene() {
  const by = 2400;
  if (!appConfig.isDevelopment || 1) {
    const { unitItems, wireItems } = extractPresetUnitItems([
      {
        // destSpec: primaryDest("$output"),
        destUnitId: "$output",
        unitId: "builtInPreOutput",
        internalUnitKey: "builtInVisualizer",
        position: { x: 4500, y: by + 50 },
      },
      {
        destUnitId: "builtInPreOutput",
        unitId: "unit1",
        catalogKey: "miniSynthGe",
        position: { x: 4500, y: by + 260 },
      },
      // {
      //   destUnitId: "unit1",
      //   unitId: "unit2",
      //   catalogKey: "perseq",
      //   position: { x: 4500, y: by + 450 },
      // },
      {
        destUnitId: "unit1",
        unitId: "builtInKeyboard",
        internalUnitKey: "builtInKeyboard",
        position: { x: 4600, y: by + 640 },
      },
      // {
      //   unitId: "chordCaster1",
      //   catalogKey: "chordCaster",
      //   position: { x: 4000, y: by + 450 },
      // },
    ]);
    store.assign({
      unitItems,
      wireItems,
      sight: { eyeScaling: 1.0, eyeOffset: { x: 200, y: 250 } },
    });
    // store.setUnitItems(unitItems);
    // store.patchSight({ eyeScaling: 1.0, eyeOffset: { x: 200, y: 250 } });
  } else {
    const by = 2400;
    const unitItems: UnitItem[] = [
      {
        // destSpec: primaryDest("$output"),
        unitId: "builtInPreOutput",
        internalUnitKey: "builtInVisualizer",
        position: { x: 4500, y: by + 100 },
      },
      {
        unitId: "builtInKeyboard",
        internalUnitKey: "builtInKeyboard",
        position: { x: 4600, y: by + 620 },
      },
    ];
    store.setUnitItems(unitItems);
  }
}
