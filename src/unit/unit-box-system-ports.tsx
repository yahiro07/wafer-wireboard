import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { ReactNode, useMemo } from "react";
import { Icons } from "@/common/icons";
import { bgSpecs } from "@/common/theme";
import { UnitItem } from "@/model/types";
import { PortsColumn, PortsRow } from "@/unit/unit-box-base";
import { handleGripPointerDown } from "@/unit/unit-box-drag-handler";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import { UnitTemporalPort } from "@/unit/unit-temporal-ports-model";

const systemPortUnitTemporalPorts = {
  speakerInput: {
    direction: "input",
    subtype: "audio",
    portKey: "builtInPreOutput.audioInput",
    id: "builtInPreOutput.audioInput",
  },
  keyboardOutput: {
    direction: "output",
    subtype: "note",
    portKey: "builtInKeyboard.noteOutput",
    id: "builtInKeyboard.noteOutput",
  },
} satisfies Record<string, UnitTemporalPort>;

const SideGrip = ({
  unit,
  children,
}: {
  unit: UnitItem;
  children?: ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "relative w-[70px] h-[100px] flex-c pt-2 cursor-pointer text-gray-300",
        bgSpecs.unitCardFrame,
      )}
      onPointerDown={(e) => handleGripPointerDown(e, unit)}
    >
      {children}
    </div>
  );
};

const SideGripDummy = () => {
  return <div className="w-[80px] h-[120px]" />;
};

const SystemPortBox = ({
  unit,
  outputPorts,
  inputPorts,
  wireVertical,
  SideIconContent,
  contentBgColor,
}: {
  unit: UnitItem;
  outputPorts: UnitTemporalPort[] | undefined;
  inputPorts: UnitTemporalPort[] | undefined;
  wireVertical: boolean;
  SideIconContent: ReactNode;
  contentBgColor: string;
}) => {
  return (
    <div
      className="absolute"
      style={{
        left: npx(unit.position.x),
        top: npx(unit.position.y),
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative shadow-md flex-ha">
        <div className={wireVertical ? "flex-v" : "flex-h"}>
          {wireVertical && (
            <PortsRow ports={outputPorts} unitPosition={unit.position} />
          )}
          {!wireVertical && (
            <PortsColumn ports={inputPorts} unitPosition={unit.position} />
          )}
          <div className="flex-h">
            <SideGrip unit={unit}>{SideIconContent}</SideGrip>
            <div
              className="flex-h w-[290px] h-[100px]"
              style={{ background: contentBgColor }}
            >
              <UnitFrameEx unitId={unit.unitId} catalogKey={unit.catalogKey} />
            </div>
          </div>
          {!wireVertical && (
            <PortsColumn ports={outputPorts} unitPosition={unit.position} />
          )}
          {wireVertical && (
            <PortsRow ports={inputPorts} unitPosition={unit.position} />
          )}
        </div>
      </div>
    </div>
  );
};

export const SpeakerSystemPortBox = ({
  unit,
  wireVertical,
}: {
  unit: UnitItem;
  wireVertical: boolean;
}) => {
  const inputPorts = useMemo(
    () => [systemPortUnitTemporalPorts.speakerInput],
    [],
  );
  return (
    <SystemPortBox
      unit={unit}
      outputPorts={undefined}
      inputPorts={inputPorts}
      wireVertical={wireVertical}
      SideIconContent={<Icons.Speaker size={55} />}
      contentBgColor="black"
    />
  );
};

export const KeyboardSystemPortBox = ({
  unit,
  wireVertical,
}: {
  unit: UnitItem;
  wireVertical: boolean;
}) => {
  const outputPorts = useMemo(
    () => [systemPortUnitTemporalPorts.keyboardOutput],
    [],
  );
  return (
    <SystemPortBox
      unit={unit}
      outputPorts={outputPorts}
      inputPorts={undefined}
      wireVertical={wireVertical}
      SideIconContent={<Icons.Piano size={55} />}
      contentBgColor="white"
    />
  );
};
