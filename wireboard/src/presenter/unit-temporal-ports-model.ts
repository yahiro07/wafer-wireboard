import { HsUnitInstance } from "wafer-host/core";
import { PortSubtype } from "@/model/types";

type UnitTemporalPortType =
  | "primaryOutput"
  | "primaryInput"
  | "additionalOutput"
  | "additionalInput";

export type UnitTemporalPort = {
  portType: UnitTemporalPortType;
  subtypes: PortSubtype[];
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
  const model: UnitTemporalPortsModel = {};

  const {
    unitId,
    outputPorts,
    inputPorts,
    additionalAudioInputs,
    additionalAudioOutputs,
  } = unitInstance;

  if (outputPorts) {
    const subtypes = [
      outputPorts.audioOutput && "audio",
      outputPorts.noteOutput && "note",
      outputPorts.automationOutput && "automation",
    ].filter(Boolean) as PortSubtype[];
    if (subtypes.length > 0) {
      model.primaryOut = {
        portType: "primaryOutput",
        id: "primaryOutput",
        portKey: `${unitId}.primaryOutput`,
        subtypes,
      };
    }
  }
  if (inputPorts) {
    const ports = inputPorts;
    const subtypes = [
      ports.audioInput && "audio",
      ports.noteInput && "note",
      ports.automationInput && "automation",
    ].filter(Boolean) as PortSubtype[];
    if (subtypes.length > 0) {
      model.primaryIn = {
        portType: "primaryInput",
        id: "primaryInput",
        portKey: `${unitId}.primaryInput`,
        subtypes,
      };
    }
  }
  const additional: UnitTemporalPort[] = [
    ...(additionalAudioOutputs
      ? Object.values(additionalAudioOutputs).map(
          (p): UnitTemporalPort => ({
            portType: "additionalOutput",
            subtypes: ["audio"],
            id: p.id,
            portKey: `${unitId}.${p.id}`,
            label: p.label,
          }),
        )
      : []),
    ...(additionalAudioInputs
      ? Object.values(additionalAudioInputs).map(
          (p): UnitTemporalPort => ({
            portType: "additionalInput",
            subtypes: ["audio"],
            id: p.id,
            portKey: `${unitId}.${p.id}`,
            label: p.label,
          }),
        )
      : []),
  ];
  if (additional.length > 0) {
    model.additional = additional;
  }

  if (1) {
    model.additional = [
      {
        portType: "additionalOutput",
        subtypes: ["audio"],
        id: "kick",
        portKey: `${unitId}.kick`,
        label: "kick",
      },
      {
        portType: "additionalInput",
        subtypes: ["audio"],
        id: "detector",
        portKey: `${unitId}.detector`,
        label: "detector",
      },
    ];
  }
  return model;
}
