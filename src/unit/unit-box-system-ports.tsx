import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { ReactNode, useMemo } from "react";
import { Icons, IconsEx } from "@/common/icons";
import { bgSpecs } from "@/common/theme";
import { UnitItem } from "@/model/types";
import { PortsColumn, PortsRow } from "@/unit/unit-box-base";
import { handleGripPointerDown } from "@/unit/unit-box-drag-handler";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import { UnitTemporalPort } from "@/unit/unit-temporal-ports-model";
import { store } from "@/model/store";

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
        "relative w-[70px] h-[100px] flex-c cursor-pointer text-gray-300",
        bgSpecs.unitCardFrame,
      )}
      onPointerDown={(e) => handleGripPointerDown(e, unit)}
    >
      {children}
    </div>
  );
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
      className="absolute z-10"
      style={{
        left: npx(unit.position.x),
        top: npx(unit.position.y),
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative flex-ha">
        <div className={wireVertical ? "flex-v" : "flex-h"}>
          {wireVertical && (
            <PortsRow ports={outputPorts} unitPosition={unit.position} />
          )}
          {!wireVertical && (
            <PortsColumn ports={inputPorts} unitPosition={unit.position} />
          )}
          <div className="flex-h shadow-md">
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

const AutoTargetButton = () => {
  const { keyboardAutoTargetEnabled: active, wireVertical } =
    store.useSnapshot();
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={store.toggleKeyboardAutoTargetEnabled}
    >
      <IconsEx.KeyboardAutoTarget
        size={24}
        className={clsx(
          "cursor-pointer",
          active && "text-cyan-500",
          !wireVertical && "rotate-90",
        )}
      />
    </button>
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
      SideIconContent={
        <div className="w-full h-full flex-c">
          <Icons.Piano size={55} />
          <div className="absolute top-0 left-0">
            <AutoTargetButton />
          </div>
        </div>
      }
      contentBgColor="white"
    />
  );
};
