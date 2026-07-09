import { createWireItem } from "@/model/factory";
import { store } from "@/model/store";
import { UnitItem, WireItem } from "@/model/types";

type ConnectionRule = {
  sourcePortId: string;
  destinationPortId: string;
};

const unitInitialWiringRules = [
  {
    sourceCatalogKey: "warpMixEmitter",
    destinationCatalogKey: "warpMixReceiver",
    connectionRules: [
      {
        sourcePortId: "primaryOutput",
        destinationPortId: "primaryInput",
      },
      {
        sourcePortId: "auxOutput",
        destinationPortId: "auxInput",
      },
    ],
  },
];

function makeConnectionWires(
  sourceUnits: UnitItem[],
  destinationUnits: UnitItem[],
  rule: ConnectionRule,
) {
  const wires: WireItem[] = [];
  for (const sourceUnit of sourceUnits) {
    for (const destinationUnit of destinationUnits) {
      const sourcePortKey = `${sourceUnit.unitId}.${rule.sourcePortId}`;
      const destinationPortKey = `${destinationUnit.unitId}.${rule.destinationPortId}`;
      const wireItem = createWireItem(sourcePortKey, destinationPortKey);
      wires.push(wireItem);
    }
  }
  return wires;
}

export function applyWarpMixInitialWiring_onUnitAdded(unitId: string) {
  const unitItem = store.state.unitItems.find((item) => item.unitId === unitId);
  if (!unitItem) return;
  const catalogKey = unitItem.catalogKey;
  const wiringRules = unitInitialWiringRules.filter(
    (rule) =>
      rule.sourceCatalogKey === catalogKey ||
      rule.destinationCatalogKey === catalogKey,
  );
  if (wiringRules.length === 0) return;

  const wiresAdded: WireItem[] = [];
  for (const rule of wiringRules) {
    if (unitItem.catalogKey === rule.sourceCatalogKey) {
      const destUnitItems = store.state.unitItems.filter(
        (item) => item.catalogKey === rule.destinationCatalogKey,
      );
      for (const connRule of rule.connectionRules) {
        const wires = makeConnectionWires([unitItem], destUnitItems, connRule);
        wiresAdded.push(...wires);
      }
    } else if (unitItem.catalogKey === rule.destinationCatalogKey) {
      const sourceUnitItems = store.state.unitItems.filter(
        (item) => item.catalogKey === rule.sourceCatalogKey,
      );
      for (const connRule of rule.connectionRules) {
        const wires = makeConnectionWires(
          sourceUnitItems,
          [unitItem],
          connRule,
        );
        wiresAdded.push(...wires);
      }
    }
  }
  if (wiresAdded.length > 0) {
    store.setWireItems((prev) => [...prev, ...wiresAdded]);
  }
}
