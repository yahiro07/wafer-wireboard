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

type HostStateBus = {
  units: Record<string, HsUnitInstance>;
};

type PendingUnitRecord = {
  unitId: string;
  promise: Promise<HsUnitInstance>;
};

type ReservedConnectionRecord = {
  destSpec: UnitDestinationSpec | undefined;
  cleanup?: () => void;
};

type HostSystem = {
  getUnitInstance(unitId: string): HsUnitInstance | undefined;
  registerUnitInstance(unit: HsUnitInstance): () => void;
  registerPendingUnitInstancePromise(
    unitId: string,
    unitInstancePromise: Promise<HsUnitInstance>,
  ): () => void;
  reserveConnectionChange(
    srcUnitId: string,
    destSpec: UnitDestinationSpec | undefined,
  ): void;
  waitPendingUnits(): Promise<void>;
};

function createHostStateBus(): HostStateBus {
  return {
    units: {},
  };
}

function createUnitLoadingHandlers(bus: HostStateBus) {
  const audioDestinationUnitInputPort: HsUnitInputPort = {
    audioInput: { node: gAudioContext.destination },
  };
  const pendingUnitInstancePromises = new Map<string, PendingUnitRecord>();
  const reservedConnections = new Map<string, ReservedConnectionRecord>();
  let connectionsActivated = false;

  function registerUnitInstanceImpl(unit: HsUnitInstance) {
    bus.units[unit.unitId] = unit;
    if (connectionsActivated) {
      reconcileAllReservedConnections();
    }
    return () => {
      if (bus.units[unit.unitId] === unit) {
        delete bus.units[unit.unitId];
      }
    };
  }

  function getConnectionTargetPort(
    destSpec: string,
  ): HsUnitInputPort | undefined {
    if (destSpec === "$output") {
      return audioDestinationUnitInputPort;
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

  function cleanupReservedConnection(srcUnitId: string) {
    const reservedConnection = reservedConnections.get(srcUnitId);
    reservedConnection?.cleanup?.();
    if (reservedConnection) {
      reservedConnection.cleanup = undefined;
    }
  }

  function reconcileReservedConnection(srcUnitId: string) {
    cleanupReservedConnection(srcUnitId);

    const reservedConnection = reservedConnections.get(srcUnitId);
    if (!reservedConnection?.destSpec) {
      return;
    }

    const unit = bus.units[srcUnitId];
    if (!unit) {
      return;
    }

    const cleanup = connectUnitToDestination(unit, reservedConnection.destSpec);
    if (cleanup) {
      reservedConnection.cleanup = cleanup;
    }
  }

  function reconcileAllReservedConnections() {
    for (const srcUnitId of reservedConnections.keys()) {
      reconcileReservedConnection(srcUnitId);
    }
  }

  function connectUnitToDestPort(
    unit: HsUnitInstance,
    destSpec: string,
    outputPortIndex?: number,
  ) {
    const [srcPort, srcSpec] = getUnitSourcePort(unit, outputPortIndex);
    const destPort = getConnectionTargetPort(destSpec);
    if (srcPort && destPort) {
      console.log(`connecting ${srcSpec} --> ${destSpec}`);
      srcPort.connectTo(destPort);
      return () => {
        console.log(`disconnecting ${srcSpec} --> ${destSpec}`);
        srcPort.disconnectFrom(destPort);
      };
    }

    return undefined;
  }

  function connectUnitToDestination(
    unit: HsUnitInstance,
    destSpec: string | string[],
  ) {
    const cleanupFns: Array<() => void> = [];

    const appendCleanup = (cleanup: (() => void) | undefined) => {
      if (cleanup) {
        cleanupFns.push(cleanup);
      }
    };

    if (Array.isArray(destSpec)) {
      destSpec.forEach((spec, i) => {
        appendCleanup(connectUnitToDestPort(unit, spec, i));
      });
    } else if (destSpec.includes("&")) {
      const foundDestSpecs = splitFanoutDestSpecs(destSpec);
      foundDestSpecs.forEach((spec) => {
        appendCleanup(connectUnitToDestPort(unit, spec));
      });
    } else {
      appendCleanup(connectUnitToDestPort(unit, destSpec));
    }

    if (cleanupFns.length === 0) {
      return undefined;
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }

  return {
    registerUnitInstance(unit: HsUnitInstance): () => void {
      registerUnitInstanceImpl(unit);
      return () => {
        cleanupReservedConnection(unit.unitId);
        if (bus.units[unit.unitId] === unit) {
          delete bus.units[unit.unitId];
        }
      };
    },
    registerPendingUnitInstancePromise(
      unitId: string,
      unitInstancePromise: Promise<HsUnitInstance>,
    ): () => void {
      const pendingUnitRecord = { unitId, promise: unitInstancePromise };
      pendingUnitInstancePromises.set(unitId, pendingUnitRecord);
      return () => {
        const currentPendingUnitRecord =
          pendingUnitInstancePromises.get(unitId);
        if (currentPendingUnitRecord?.promise === unitInstancePromise) {
          pendingUnitInstancePromises.delete(unitId);
        }
      };
    },
    reserveConnectionChange(
      srcUnitId: string,
      destSpec: UnitDestinationSpec | undefined,
    ): void {
      const reservedConnection = reservedConnections.get(srcUnitId);
      if (reservedConnection) {
        reservedConnection.destSpec = destSpec;
      } else {
        reservedConnections.set(srcUnitId, {
          destSpec,
        });
      }

      if (connectionsActivated) {
        reconcileReservedConnection(srcUnitId);
      }
    },
    async waitPendingUnits(): Promise<void> {
      while (pendingUnitInstancePromises.size > 0) {
        const pendingRecords = [...pendingUnitInstancePromises.values()];
        await Promise.allSettled(
          pendingRecords.map((record) => record.promise),
        );

        for (const pendingRecord of pendingRecords) {
          const currentPendingRecord = pendingUnitInstancePromises.get(
            pendingRecord.unitId,
          );
          if (currentPendingRecord?.promise === pendingRecord.promise) {
            pendingUnitInstancePromises.delete(pendingRecord.unitId);
          }
        }
      }

      connectionsActivated = true;
      reconcileAllReservedConnections();
    },
  };
}

function createHostSystem(): HostSystem {
  const bus = createHostStateBus();
  const loadingHandlers = createUnitLoadingHandlers(bus);

  return {
    getUnitInstance(unitId: string) {
      return bus.units[unitId];
    },
    ...loadingHandlers,
  };
}

export const hostSystem = createHostSystem();
