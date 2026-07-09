import { HsUnitInstance } from "wafer-host/core";
import { PortDirection, PortSubtype } from "@/model/types";

type UnitTemporalPortType =
  | "primaryOutput"
  | "primaryInput"
  | "additionalOutput"
  | "additionalInput";

export type UnitTemporalPort = {
  portType: UnitTemporalPortType;
  direction: PortDirection;
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
        direction: "output",
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
        direction: "input",
        id: "primaryInput",
        portKey: `${unitId}.primaryInput`,
        subtypes,
      };
    }
  }
  const additional: UnitTemporalPort[] = [
    ...(additionalAudioInputs
      ? Object.values(additionalAudioInputs).map(
          (p): UnitTemporalPort => ({
            portType: "additionalInput",
            direction: "input",
            subtypes: ["audio"],
            id: p.id,
            portKey: `${unitId}.${p.id}`,
            label: p.label,
          }),
        )
      : []),
    ...(additionalAudioOutputs
      ? Object.values(additionalAudioOutputs).map(
          (p): UnitTemporalPort => ({
            portType: "additionalOutput",
            direction: "output",
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

  if (0) {
    //debug
    model.additional = [
      {
        portType: "additionalOutput",
        direction: "output",
        subtypes: ["audio"],
        id: "kick",
        portKey: `${unitId}.kick`,
        label: "kick",
      },
      {
        portType: "additionalInput",
        direction: "input",
        subtypes: ["audio"],
        id: "detector",
        portKey: `${unitId}.detector`,
        label: "detector",
      },
    ];
  }
  return model;
}
