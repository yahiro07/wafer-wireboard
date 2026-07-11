import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { ReactNode } from "react";
import { Icons } from "@/common/icons";
import { bgSpecs } from "@/common/theme";
import { UnitItem } from "@/model/types";
import { KeyboardPortCell, SpeakerPortCell } from "@/port/port-cell";
import { handleGripPointerDown } from "@/unit/unit-box-drag-handler";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import { UnitTemporalPort } from "@/unit/unit-temporal-ports-model";

const systemPortUnitTemporalPorts = {
  speakerInput: {
    direction: "input",
    subtype: "audio",
    portKey: "builtInPreOutput.primaryInput",
    id: "builtInPreOutput.primaryInput",
  },
  keyboardOutput: {
    direction: "output",
    subtype: "note",
    portKey: "builtInKeyboard.primaryOutput",
    id: "builtInKeyboard.primaryOutput",
  },
} satisfies Record<string, UnitTemporalPort>;

const SystemPortBox = ({
  unit,
  iconContent,
  sideContentL,
  sideContentR,
}: {
  unit: UnitItem;
  iconContent: ReactNode;
  sideContentL?: ReactNode;
  sideContentR?: ReactNode;
}) => {
  const sd = { width: 560, height: 120 };
  return (
    <div
      className="absolute"
      style={{
        left: npx(unit.position.x - sd.width / 2),
        top: npx(unit.position.y - sd.height / 2),
      }}
    >
      <div className="relative shadow-md flex-ha">
        {sideContentL}
        <div
          className={clsx(
            "flex-c w-[80px] h-[120px] text-gray-300",
            bgSpecs.unitCardFrame,
          )}
        >
          {iconContent}
        </div>
        {sideContentR}
      </div>
    </div>
  );
};

export const SpeakerSystemPortBox = ({ unit }: { unit: UnitItem }) => {
  return (
    <SystemPortBox
      unit={unit}
      iconContent={
        <SpeakerPortCell
          port={systemPortUnitTemporalPorts.speakerInput}
          unitPosition={unit.position}
        >
          <div
            className="relative w-full h-full flex-c pt-2 cursor-pointer"
            onPointerDown={(e) => handleGripPointerDown(e, unit)}
          >
            <Icons.Speaker size={65} />
          </div>
        </SpeakerPortCell>
      }
      sideContentR={
        <div className="flex-h w-[340px] h-[120px]">
          <div className="w-full h-full bg-black text-white">
            <UnitFrameEx unitId={unit.unitId} catalogKey={unit.catalogKey} />
          </div>
        </div>
      }
    />
  );
};

export const KeyboardSystemPortBox = ({ unit }: { unit: UnitItem }) => {
  return (
    <SystemPortBox
      unit={unit}
      iconContent={
        <div
          className="relative w-full h-full flex-c pt-2"
          onPointerDown={(e) => handleGripPointerDown(e, unit)}
        >
          <Icons.Piano size={65} />
          <div className="absolute-full flex-v items-center cursor-pointer pt-0.5">
            <KeyboardPortCell
              port={systemPortUnitTemporalPorts.keyboardOutput}
              unitPosition={unit.position}
            />
          </div>
        </div>
      }
      sideContentL={
        <div className="flex-h w-[340px] h-[120px]">
          <div className="w-full h-full bg-white text-black">
            <UnitFrameEx unitId={unit.unitId} catalogKey={unit.catalogKey} />
          </div>
        </div>
      }
    />
  );
};
