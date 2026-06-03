import { PortSubtype } from "@/contract/unit-interfaces";
import { PortDirection } from "@/host-app/types";

export function getPortKey(
  unitId: string,
  direction: PortDirection,
  portIndex?: number,
) {
  if (portIndex !== undefined) {
    return `${unitId}.${direction === "output" ? "outputs" : "inputs"}.${portIndex}`;
  } else {
    return `${unitId}.${direction === "output" ? "output" : "input"}`;
  }
}

type DecodedPort = {
  unitId: string;
  direction: PortDirection;
  portIndex?: number;
};

export function decodePortKey(portKey: string): DecodedPort {
  const [unitId, portType, portIndexStr] = portKey.split(".");
  const portIndex = portIndexStr
    ? Number.parseInt(portIndexStr, 10)
    : undefined;
  const direction =
    portType === "outputs" || portType === "output" ? "output" : "input";
  return { unitId, direction, portIndex };
}

export function mapDestSpecToPortKeys(destSpec: string): string[] {
  if (destSpec.includes("&")) {
    return destSpec
      .split("&")
      .map((spec) => spec.trim())
      .filter(Boolean)
      .flatMap(mapDestSpecToPortKeys);
  } else {
    const [unitId, portPart] = destSpec.split(".");
    const portIndex = portPart?.startsWith("port")
      ? Number.parseInt(portPart.slice("port".length), 10)
      : undefined;
    return [getPortKey(unitId, "input", portIndex)];
  }
}

export function mapPortKeyToDestSpec(portKey: string): string | undefined {
  const { unitId, direction, portIndex } = decodePortKey(portKey);
  if (direction === "input") {
    if (portIndex !== undefined) {
      return `${unitId}.port${portIndex}`;
    } else {
      return `${unitId}`;
    }
  }
}

export function checkSubtypeOverlap(
  subtypes1: PortSubtype[],
  subtypes2: PortSubtype[],
): boolean {
  return subtypes1.some((st) => subtypes2.includes(st));
}

export function getUnitIdFromPortKey(portKey: string) {
  return portKey.split(".")[0];
}

export function getDomPortCellId(portKey: string) {
  return `domPortCell__${portKey}`;
}

export function getDomUnitBoxId(unitId: string) {
  return `domUnitBox__${unitId}`;
}

export const domEditAreaId = "domEditArea";
