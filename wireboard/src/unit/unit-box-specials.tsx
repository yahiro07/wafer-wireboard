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

const SystemPortBox = ({
  unit,
  iconContent,
  sideContent,
}: {
  unit: UnitItem;
  iconContent: ReactNode;
  sideContent?: ReactNode;
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
      <div className="relative">
        <div
          className={clsx(
            "flex-c w-[80px] h-[120px] text-gray-300",
            bgSpecs.unitCardFrame,
          )}
        >
          {iconContent}
        </div>
        <div className="absolute left-[80px] top-0">
          <div className="flex-h w-[400px] h-[120px]">
            <div className="grow">{sideContent}</div>
            <div className={clsx("w-[80px]", bgSpecs.unitCardFrame)}>
              <div
                className="flex-c text-[40px] cursor-pointer text-white h-full"
                onPointerDown={(e) => handleGripPointerDown(e, unit)}
              >
                <Icons.Grip />
              </div>
            </div>
          </div>
        </div>
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
      sideContent={
        <div className="h-full bg-black text-white">
          <UnitFrameEx unitId={unit.unitId} catalogKey={unit.catalogKey} />
        </div>
      }
    />
  );
};

const systemPortUnitTemporalPorts = {
  speakerInput: {
    portType: "primaryInput",
    direction: "input",
    subtypes: ["audio"],
    portKey: "builtInPreOutput.primaryInput",
    id: "builtInPreOutput.primaryInput",
  },
  keyboardOutput: {
    portType: "primaryOutput",
    direction: "output",
    subtypes: ["note"],
    portKey: "builtInKeyboard.primaryOutput",
    id: "builtInKeyboard.primaryOutput",
  },
} satisfies Record<string, UnitTemporalPort>;

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
      sideContent={
        <div className="h-full bg-white text-black">
          <UnitFrameEx unitId={unit.unitId} catalogKey={unit.catalogKey} />
        </div>
      }
    />
  );
};
