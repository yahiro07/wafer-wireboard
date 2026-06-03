import { gAudioContext } from "@/framework/host/host-core";
import { HsUnitInputPort, HsUnitInstance } from "@/framework/host/host-types";

type HostStateBus = {
  units: Record<string, HsUnitInstance>;
};

type HostSystem = {
  getUnitInstance(unitId: string): HsUnitInstance | undefined;
  registerUnitInstance(unit: HsUnitInstance): () => void;
  onUnitRegistered(listener: (unitId: string) => void): () => void;
  getConnectionTargetPort(destSpec: string): HsUnitInputPort | undefined;
};

function createHostStateBus(): HostStateBus {
  return {
    units: {},
  };
}

function createRegistrationHandlers(bus: HostStateBus) {
  const unitRegisteredListeners: Set<(unitId: string) => void> = new Set();
  return {
    registerUnitInstance(unit: HsUnitInstance) {
      bus.units[unit.unitId] = unit;
      for (const listener of unitRegisteredListeners) {
        listener(unit.unitId);
      }
      return () => {
        if (bus.units[unit.unitId] === unit) {
          delete bus.units[unit.unitId];
        }
      };
    },
    onUnitRegistered(listener: (unitId: string) => void) {
      unitRegisteredListeners.add(listener);
      return () => {
        unitRegisteredListeners.delete(listener);
      };
    },
  };
}

function createConnectionHandlers(bus: HostStateBus) {
  const audioDestinationUnitInputPort: HsUnitInputPort = {
    audioInput: { node: gAudioContext.destination },
  };
  return {
    getConnectionTargetPort(destSpec: string): HsUnitInputPort | undefined {
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
    },
  };
}

function createHostSystem(): HostSystem {
  const bus = createHostStateBus();
  const registrationHandlers = createRegistrationHandlers(bus);
  const connectionHandlers = createConnectionHandlers(bus);

  return {
    getUnitInstance(unitId: string) {
      return bus.units[unitId];
    },
    ...registrationHandlers,
    ...connectionHandlers,
  };
}

export const hostSystem = createHostSystem();
