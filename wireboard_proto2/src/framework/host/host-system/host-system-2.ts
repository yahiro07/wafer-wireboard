import { createEventPort, EventPort } from "beams/mo/event-port";
import { gAudioContext } from "@/framework/host/host-core";
import {
  HsUnitInputPort,
  HsUnitInstance,
  UnitDestinationSpec,
} from "@/framework/host/host-types";
import {
  getUnitSourcePort,
  splitFanoutDestSpecs,
} from "@/framework/host/unit-connecter";

type HostSystemEvent =
  | { type: "loadStarted" }
  | { type: "loadCompleted" }
  | { type: "unitsAdded"; units: HsUnitInstance[] }
  | { type: "unitsRemoved"; unitIds: string[] };

type HostSystem = {
  eventPort: EventPort<HostSystemEvent>;
  registerUnitInstance(unit: HsUnitInstance): void;
  registerPendingUnitInstancePromise(
    unitInstancePromise: Promise<HsUnitInstance>,
  ): void;
  unregisterUnitInstance(unitId: string): void;
  reserveConnectionChange(
    srcUnitId: string,
    destSpec: UnitDestinationSpec | undefined,
  ): void;
};

type HostStateBus = {
  eventPort: EventPort<HostSystemEvent>;
  audioDestinationUnitInputPort: HsUnitInputPort;
  units: Record<string, HsUnitInstance>;
  addUnits(units: HsUnitInstance[]): void;
  getAllUnits(): HsUnitInstance[];
  removeUnit(unitId: string): void;
};

function createHostStateBus(): HostStateBus {
  const eventPort = createEventPort<HostSystemEvent>();
  const audioDestinationUnitInputPort: HsUnitInputPort = {
    audioInput: { node: gAudioContext.destination },
  };
  const units: Record<string, HsUnitInstance> = {};

  return {
    eventPort,
    audioDestinationUnitInputPort,
    units,
    addUnits(newUnits: HsUnitInstance[]) {
      for (const unit of newUnits) {
        units[unit.unitId] = unit;
      }
    },
    getAllUnits() {
      return Object.values(units);
    },
    removeUnit(unitId: string) {
      delete units[unitId];
    },
  };
}

type DestinationsCode = string;

function mapDestSpecToDestCode(
  destSpec: UnitDestinationSpec | undefined,
): DestinationsCode {
  if (Array.isArray(destSpec)) {
    return destSpec.join("|");
  } else if (destSpec) {
    return destSpec;
  } else {
    return "";
  }
}

function getConnectionTargetPort(
  bus: HostStateBus,
  destSpec: string,
): HsUnitInputPort | undefined {
  if (destSpec === "$output") {
    return bus.audioDestinationUnitInputPort;
  }
  if (destSpec.includes(".")) {
    const [unitId, portName] = destSpec.split(".");
    const portIndex = parseInt(portName.replace("port", ""), 10);
    if (unitId && Number.isFinite(portIndex)) {
      const unit = bus.units[unitId];
      return unit?.inputPorts?.[portIndex];
    }
  } else {
    const unit = bus.units[destSpec];
    return unit?.inputPort;
  }
}

type ConnectingOperation = "connect" | "disconnect";

function updateUnitConnectionToPort(
  bus: HostStateBus,
  unit: HsUnitInstance,
  destSpec: string,
  operation: ConnectingOperation,
  outputPortIndex?: number,
) {
  const [srcPort, srcSpec] = getUnitSourcePort(unit, outputPortIndex);
  const destPort = getConnectionTargetPort(bus, destSpec);
  if (srcPort && destPort) {
    if (operation === "connect") {
      console.log(`connecting ${srcSpec} --> ${destSpec}`);
      srcPort.connectTo(destPort);
    } else if (operation === "disconnect") {
      console.log(`disconnecting ${srcSpec} --> ${destSpec}`);
      srcPort.disconnectFrom(destPort);
    }
  }
}

function updateUnitConnectionsByDestSpec(
  bus: HostStateBus,
  unit: HsUnitInstance,
  destSpec: UnitDestinationSpec,
  operation: ConnectingOperation,
) {
  if (Array.isArray(destSpec)) {
    destSpec.forEach((spec, i) => {
      updateUnitConnectionToPort(bus, unit, spec, operation, i);
    });
  } else if (destSpec.includes("&")) {
    const foundDestSpecs = splitFanoutDestSpecs(destSpec);
    foundDestSpecs.forEach((spec) => {
      updateUnitConnectionToPort(bus, unit, spec, operation);
    });
  } else {
    updateUnitConnectionToPort(bus, unit, destSpec, operation);
  }
}

function updateUnitConnectionsByCodeDiff(
  bus: HostStateBus,
  unit: HsUnitInstance,
  curr: DestinationsCode | undefined,
  next: DestinationsCode | undefined,
) {
  const currs = curr?.split("|").filter(Boolean) ?? [];
  const nexts = next?.split("|").filter(Boolean) ?? [];
  const toConnect = nexts.filter((dest) => !currs.includes(dest));
  const toDisconnect = currs.filter((dest) => !nexts.includes(dest));
  for (const destSpec of toDisconnect) {
    updateUnitConnectionsByDestSpec(bus, unit, destSpec, "disconnect");
  }
  for (const destSpec of toConnect) {
    updateUnitConnectionsByDestSpec(bus, unit, destSpec, "connect");
  }
}

function createUnitConnectionsManager(bus: HostStateBus) {
  const connectionCodeMap: Record<string, DestinationsCode> = {};
  return {
    updateConnections(newConnectionCodeMap: Record<string, DestinationsCode>) {
      for (const [unitId, code] of Object.entries(newConnectionCodeMap)) {
        const unit = bus.units[unitId];
        if (unit) {
          const curr = connectionCodeMap[unit.unitId];
          const next = code;
          if (next !== undefined && next !== curr) {
            updateUnitConnectionsByCodeDiff(bus, unit, curr, next);
            connectionCodeMap[unit.unitId] = next;
          }
        }
      }
    },
    removeConnectionsForUnit(unitId: string) {
      const unit = bus.units[unitId];
      const curr = connectionCodeMap[unitId];
      if (unit && curr) {
        updateUnitConnectionsByCodeDiff(bus, unit, curr, "");
        delete connectionCodeMap[unitId];
      }
    },
  };
}

type PendingConnectionOrder = {
  srcUnitId: string;
  destSpec: UnitDestinationSpec | undefined;
};

function mapPendingConnectionOrdersToConnectionCodeMap(
  orders: PendingConnectionOrder[],
): Record<string, DestinationsCode> {
  const map: Record<string, DestinationsCode> = {};
  for (const { srcUnitId, destSpec } of orders) {
    map[srcUnitId] = mapDestSpecToDestCode(destSpec);
  }
  return map;
}

function createHostSystem(): HostSystem {
  const bus = createHostStateBus();
  const connectionManager = createUnitConnectionsManager(bus);
  const pendingUnitPromises: Promise<HsUnitInstance>[] = [];
  const pendingConnectionOrders: PendingConnectionOrder[] = [];

  let timerId: NodeJS.Timeout | null = null;

  const internal = {
    async waitPendingUnits() {
      bus.eventPort.emit({ type: "loadStarted" });
      if (pendingUnitPromises.length > 0) {
        const newUnits = await Promise.all(pendingUnitPromises);
        bus.addUnits(newUnits);
        bus.eventPort.emit({ type: "unitsAdded", units: newUnits });
        pendingUnitPromises.length = 0;
      }
      if (pendingConnectionOrders.length > 0) {
        const connectionCodeMap = mapPendingConnectionOrdersToConnectionCodeMap(
          pendingConnectionOrders,
        );
        connectionManager.updateConnections(connectionCodeMap);
        pendingConnectionOrders.length = 0;
      }
      bus.eventPort.emit({ type: "loadCompleted" });
      timerId = null;
    },
    reserveLoading() {
      if (!timerId) {
        timerId = setTimeout(internal.waitPendingUnits, 1);
      }
    },
  };

  return {
    eventPort: bus.eventPort,
    registerUnitInstance(unit: HsUnitInstance) {
      pendingUnitPromises.push(Promise.resolve(unit));
      internal.reserveLoading();
    },
    registerPendingUnitInstancePromise(unitInstancePromise) {
      pendingUnitPromises.push(unitInstancePromise);
      internal.reserveLoading();
    },
    unregisterUnitInstance(unitId) {
      connectionManager.removeConnectionsForUnit(unitId);
      bus.removeUnit(unitId);
    },
    reserveConnectionChange(srcUnitId, destSpec) {
      pendingConnectionOrders.push({ srcUnitId, destSpec });
      internal.reserveLoading();
    },
  };
}
export const hostSystem = createHostSystem();
