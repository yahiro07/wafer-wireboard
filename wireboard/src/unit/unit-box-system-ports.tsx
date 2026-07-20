import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { ReactNode, useMemo } from "react";
import { Icons } from "@/common/icons";
import { bgSpecs } from "@/common/theme";
import { UnitItem } from "@/model/types";
import { PortsColumn } from "@/unit/unit-box-base";
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

const SystemPortBox = ({
  unit,
  children,
  xOffset,
}: {
  unit: UnitItem;
  children: ReactNode;
  xOffset: number;
}) => {
  const sd = { width: 560, height: 120 };
  return (
    <div
      className="absolute"
      style={{
        left: npx(unit.position.x - sd.width / 2 + xOffset),
        top: npx(unit.position.y - sd.height / 2),
        // border: "solid 1px red",
      }}
    >
      <div className="relative shadow-md flex-ha">{children}</div>
    </div>
  );
};

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
        "relative w-[80px] h-[120px] flex-c pt-2 cursor-pointer text-gray-300",
        bgSpecs.unitCardFrame,
      )}
      onPointerDown={(e) => handleGripPointerDown(e, unit)}
    >
      {children}
    </div>
  );
};

export const SpeakerSystemPortBox = ({ unit }: { unit: UnitItem }) => {
  const ports = useMemo(() => [systemPortUnitTemporalPorts.speakerInput], []);
  return (
    <SystemPortBox unit={unit} xOffset={0 + 40}>
      <div className="flex-ha">
        <PortsColumn ports={ports} unitPosition={unit.position} />
        <SideGrip unit={unit}>
          <Icons.Speaker size={65} />
        </SideGrip>
        <div className="flex-h w-[320px] h-[120px]">
          <div className="w-full h-full bg-black text-white">
            <UnitFrameEx unitId={unit.unitId} catalogKey={unit.catalogKey} />
          </div>
        </div>
      </div>
    </SystemPortBox>
  );
};

export const KeyboardSystemPortBox = ({ unit }: { unit: UnitItem }) => {
  const ports = useMemo(() => [systemPortUnitTemporalPorts.keyboardOutput], []);
  return (
    <SystemPortBox unit={unit} xOffset={40 + 40}>
      <div className="flex-ha">
        <SideGrip unit={unit}>
          <Icons.Piano size={65} />
        </SideGrip>
        <div className="flex-h w-[320px] h-[120px]">
          <div className="w-full h-full bg-white text-black">
            <UnitFrameEx unitId={unit.unitId} catalogKey={unit.catalogKey} />
          </div>
        </div>
        <PortsColumn ports={ports} unitPosition={unit.position} />
      </div>
    </SystemPortBox>
  );
};
