import { useEffect } from "react";
import { store } from "@/model/store";
import { connectionLogic } from "@/port/connection-logic";
import {
  filterCandidatePorts,
  findNearestPort,
} from "@/port/port-cell-drag-handler";

const keyboardUnitId = "builtInKeyboard";

function updateKeyboardAutoTarget() {
  const keyboardPrimaryOutputPortKey = `${keyboardUnitId}.primaryOutput`;
  const existingWire = store.state.wireItems.find(
    (wire) => wire.sourcePortKey === keyboardPrimaryOutputPortKey,
  );
  if (!existingWire) return;
  const sourcePort = store.state.portItems[keyboardPrimaryOutputPortKey];
  if (!sourcePort) return;
  const portItems = Object.values(store.state.portItems);
  const ports = filterCandidatePorts(portItems, keyboardUnitId, ["note"]);
  const nearestPort = findNearestPort(ports, sourcePort.position, true);
  if (nearestPort && nearestPort.portKey !== existingWire.destinationPortKey) {
    connectionLogic.setConnectionSingle(
      sourcePort.portKey,
      nearestPort.portKey,
    );
  }
}

export function useKeyboardAutoTarget() {
  const { unitItems } = store.useSnapshot();
  const keyboardUnit = unitItems.find((item) => item.unitId === keyboardUnitId);
  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    if (store.state.unitsLoading) return;
    updateKeyboardAutoTarget();
  }, [keyboardUnit?.position]);
}
