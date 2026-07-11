import {
  HsPortDirection,
  HsPortInfoAdditional,
  HsPortInfoPrimary,
  HsPortSubtype,
  HsUnitInstance,
} from "wafer-host/core";

type UnitTemporalPortType =
  | "primaryOutput"
  | "primaryInput"
  | "additionalOutput"
  | "additionalInput";

export type UnitTemporalPort = {
  portType: UnitTemporalPortType;
  direction: HsPortDirection;
  subtypes: HsPortSubtype[];
  portKey: string;
  id: string;
  label?: string;
};

type UnitTemporalPortsModel = {
  primaryOut?: UnitTemporalPort;
  primaryIn?: UnitTemporalPort;
  additional?: UnitTemporalPort[];
};

export function buildUnitTemporalPortsModel(
  unitInstance: HsUnitInstance,
): UnitTemporalPortsModel {
  const { unitId, portInfos } = unitInstance;

  const primOut = portInfos.find(
    (p) => p.type === "primary" && p.direction === "output",
  ) as HsPortInfoPrimary | undefined;
  const primIn = portInfos.find(
    (p) => p.type === "primary" && p.direction === "input",
  ) as HsPortInfoPrimary;
  const additionalOuts = portInfos.filter(
    (p) =>
      p.type === "additional" &&
      p.direction === "output" &&
      p.subtype === "audio",
  ) as HsPortInfoAdditional[];
  const additionalIns = portInfos.filter(
    (p) =>
      p.type === "additional" &&
      p.direction === "input" &&
      p.subtype === "audio",
  ) as HsPortInfoAdditional[];

  return {
    primaryOut: primOut
      ? {
          portType: "primaryOutput",
          direction: "output",
          id: "primaryOutput",
          portKey: `${unitId}.primaryOutput`,
          subtypes: primOut.subtypes,
        }
      : undefined,
    primaryIn: primIn
      ? {
          portType: "primaryInput",
          direction: "input",
          id: "primaryInput",
          portKey: `${unitId}.primaryInput`,
          subtypes: primIn.subtypes,
        }
      : undefined,
    additional: [
      ...additionalIns.map((p) => ({
        portType: "additionalInput" as const,
        direction: p.direction,
        id: p.portId,
        portKey: `${unitId}.${p.portId}`,
        subtypes: [p.subtype],
        label: p.label,
      })),
      ...additionalOuts.map((p) => ({
        portType: "additionalOutput" as const,
        direction: p.direction,
        id: p.portId,
        portKey: `${unitId}.${p.portId}`,
        subtypes: [p.subtype],
        label: p.label,
      })),
    ],
  };
}
