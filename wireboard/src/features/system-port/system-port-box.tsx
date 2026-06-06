import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { ReactNode } from "react";
import { Icons, IconsEx } from "@/base/icons";
import { handleGripPointerDown } from "@/features/unit-box/common-card-handlers";
import { UnitFrameEx } from "@/features/unit-box/unit-frame-ex";
import { actions } from "@/store/actions";
import { UnitItem } from "@/store/store";
import { SystemControlUiA, SystemControlUiB } from "./system-control-ui";

const SystemPortBox = ({
  unit,
  iconContent,
  sideContent,
  yOffset = 0,
  additionalUi,
}: {
  unit: UnitItem;
  iconContent: ReactNode;
  sideContent?: ReactNode;
  additionalUi?: ReactNode;
  yOffset?: number;
}) => {
  return (
    <div
      className={clsx("absolute -translate-x-1/2 -translate-y-1/2")}
      style={{
        left: npx(unit.position.x),
        top: npx(unit.position.y + yOffset),
      }}
    >
      <div className="relative">
        <div className="flex-c w-[80px] h-[120px] bg-gray-500 text-gray-300">
          {iconContent}
        </div>
        <div className="absolute left-[80px] top-0">
          <div className="flex-h w-[400px] h-[120px]">
            <div className="grow">{sideContent}</div>
            <div className="w-[80px] bg-gray-500">
              <div
                className="flex-c text-[40px] cursor-pointer text-white h-full"
                onPointerDown={(e) => handleGripPointerDown(e, unit)}
              >
                <Icons.Grip />
              </div>
            </div>
          </div>
        </div>
        {additionalUi}
      </div>
    </div>
  );
};

export const SpeakerSystemPortBox = ({ unit }: { unit: UnitItem }) => {
  return (
    <SystemPortBox
      unit={unit}
      yOffset={-50}
      iconContent={
        <div
          className="relative w-full h-full flex-c relative pt-2 cursor-pointer"
          onPointerDown={(e) => handleGripPointerDown(e, unit)}
        >
          <Icons.Speaker size={65} />
        </div>
      }
      sideContent={
        <div className="h-full bg-black text-white">
          <UnitFrameEx
            unitId={unit.unitId}
            destUnitId={unit.destUnitId}
            catalogKey={unit.catalogKey}
            templateFn={unit.templateFn}
          />
        </div>
      }
      additionalUi={
        <>
          <div className="absolute top-0 right-[200px] w-[300px] h-[120px] bg-gray-500 flex-c">
            <SystemControlUiA />
          </div>
          <div className="absolute top-0 left-[600px] w-[200px] h-[120px] bg-gray-500">
            <SystemControlUiB />
          </div>
        </>
      }
    />
  );
};

export const KeyboardSystemPortBox = ({
  unit,
  notes,
}: {
  unit: UnitItem;
  notes: number[];
}) => {
  const handleKeyboardPortClick = (e: React.PointerEvent) => {
    if (unit.destUnitId === undefined) {
      actions.connectToNearestUnit("builtInKeyboard");
    } else {
      actions.removeConnection("builtInKeyboard");
    }
    e.stopPropagation();
  };
  return (
    <SystemPortBox
      unit={unit}
      yOffset={50}
      iconContent={
        <div
          className="relative w-full h-full flex-c relative pt-2"
          onPointerDown={(e) => handleGripPointerDown(e, unit)}
        >
          <Icons.Piano size={65} />

          <div className="absolute-full flex-v items-center cursor-pointer">
            <div
              onPointerDown={handleKeyboardPortClick}
              className=" w-12 h-12 flex-h justify-center pt-2 cursor-pointer"
            >
              <IconsEx.ConnectorPortUp size={18} />
            </div>
          </div>
        </div>
      }
      sideContent={
        <div className="h-full bg-white text-black">
          <UnitFrameEx
            unitId={unit.unitId}
            destUnitId={unit.destUnitId}
            catalogKey={unit.catalogKey}
            templateFn={unit.templateFn}
            notes={notes}
          />
        </div>
      }
    />
  );
};
