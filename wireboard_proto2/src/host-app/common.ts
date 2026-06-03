export function getPortKey(
  unitId: string,
  kind: "output" | "input",
  portIndex?: number,
) {
  if (portIndex !== undefined) {
    return `${unitId}.${kind === "output" ? "outputs" : "inputs"}.${portIndex}`;
  } else {
    return `${unitId}.${kind === "output" ? "output" : "input"}`;
  }
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
