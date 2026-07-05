import { npx } from "mofur/ax-ui";
import { ReactNode } from "react";
import { Icons, IconsEx } from "@/base/icons";
import { systemPortCardDimensions } from "@/base/slot-card-dimensions";
import { UnitItem } from "@/model/types";
import { connectionLogic_toggleSingleConnectionToNearest } from "@/presenter/connection-logic";
import { handleGripPointerDown } from "@/views/editor/unit-box-drag-handler";
import { UnitFrameEx } from "@/views/editor/unit-frame-ex";

const PortRelativePositionDebugOverlay = () => {
  const inputPos = systemPortCardDimensions.inputPort;
  const outputPos = systemPortCardDimensions.outputPort;
  return (
    <div className="absolute-full">
      <div
        className="absolute w-[30px] h-[30px] bg-pink-500 opacity-30"
        style={{
          left: npx(outputPos.x),
          top: npx(outputPos.y),
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute w-[30px] h-[30px] bg-pink-500 opacity-30"
        style={{
          left: npx(inputPos.x),
          top: npx(inputPos.y),
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

const SystemPortBox = ({
  unit,
  iconContent,
  sideContent,
}: {
  unit: UnitItem;
  iconContent: ReactNode;
  sideContent?: ReactNode;
}) => {
  const sd = systemPortCardDimensions;
  return (
    <div
      className="absolute"
      style={{
        left: npx(unit.position.x - sd.width / 2),
        top: npx(unit.position.y - sd.height / 2),
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
        {false && <PortRelativePositionDebugOverlay />}
      </div>
    </div>
  );
};

export const SpeakerSystemPortBox = ({ unit }: { unit: UnitItem }) => {
  return (
    <SystemPortBox
      unit={unit}
      iconContent={
        <div
          className="relative w-full h-full flex-c pt-2 cursor-pointer"
          onPointerDown={(e) => handleGripPointerDown(e, unit)}
        >
          <Icons.Speaker size={65} />
        </div>
      }
      sideContent={
        <div className="h-full bg-black text-white">
          <UnitFrameEx
            unitId={unit.unitId}
            destSpec={unit.destSpec}
            catalogKey={unit.catalogKey}
            internalUnitKey={unit.internalUnitKey}
          />
        </div>
      }
    />
  );
};

export const KeyboardSystemPortBox = ({ unit }: { unit: UnitItem }) => {
  const handleKeyboardPortClick = (e: React.PointerEvent) => {
    connectionLogic_toggleSingleConnectionToNearest(unit);
    e.stopPropagation();
  };
  return (
    <SystemPortBox
      unit={unit}
      iconContent={
        <div
          className="relative w-full h-full flex-c pt-2"
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
            destSpec={unit.destSpec}
            catalogKey={unit.catalogKey}
            internalUnitKey={unit.internalUnitKey}
          />
        </div>
      }
    />
  );
};
