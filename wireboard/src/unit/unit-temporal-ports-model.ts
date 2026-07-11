import {
  HsPortDirection,
  HsPortInfoAdditional,
  HsPortInfoPrimaryInner,
  HsPortSubtype,
  HsUnitInstance,
} from "wafer-host/core";

export type UnitTemporalPort = {
  direction: HsPortDirection;
  subtype: HsPortSubtype;
  portKey: string;
  id: string;
  label?: string;
};

type UnitTemporalPortsModel = {
  inputs: UnitTemporalPort[];
  outputs: UnitTemporalPort[];
};

const subtypeOrder = ["audio", "note", "clock", "automation"];

export function buildUnitTemporalPortsModel(
  unitInstance: HsUnitInstance,
): UnitTemporalPortsModel {
  const { unitId, portInfos } = unitInstance;

  const portsIncluded = portInfos
    .filter((p) => p.type !== "primary")
    .map((_p) => {
      const p = _p as HsPortInfoAdditional | HsPortInfoPrimaryInner;
      return {
        direction: p.direction,
        id: p.portId,
        portKey: `${unitId}.${p.portId}`,
        subtype: p.subtype,
        label: "label" in p ? p.label : undefined,
      };
    })
    .sort((a, b) => {
      const aIndex = subtypeOrder.indexOf(a.subtype);
      const bIndex = subtypeOrder.indexOf(b.subtype);
      return aIndex - bIndex;
    });
  const inputs = portsIncluded.filter((p) => p.direction === "input");
  const outputs = portsIncluded.filter((p) => p.direction === "output");
  return { inputs, outputs };
}
