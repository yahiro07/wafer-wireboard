import { npx } from "mofur/ax-ui";
import { Icons } from "@/base/icons";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { OutputPortCell, PortCell } from "@/features/unit-box/port-cell";
import { UnitFrameEx } from "@/features/unit-box/unit-frame-ex";
import { actions } from "@/store/actions";
import { UnitItem } from "@/store/store";
import { handleGripPointerDown } from "./common-card-handlers";

const PortRelativePositionDebugOverlay = () => {
  const inputPos = slotCardDimensions.inputPort;
  const outputPos = slotCardDimensions.outputPort;
  return (
    <div className="absolute w-full h-full">
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

export const SlotCardBox = ({ unit }: { unit: UnitItem }) => {
  const sd = slotCardDimensions;
  return (
    <div
      className="absolute"
      style={{
        left: npx(unit.position.x - sd.width / 2),
        top: npx(unit.position.y - sd.height / 2),
      }}
    >
      <div
        className="relative flex-h"
        style={{
          width: npx(sd.width),
          height: npx(sd.height),
        }}
      >
        <div className="w-[40px] bg-gray-500 flex-v justify-between items-center p-2">
          <OutputPortCell unit={unit} />
          <PortCell />
        </div>
        <div className="grow bg-gray-600">
          <UnitFrameEx
            unitId={unit.unitId}
            destUnitId={unit.destUnitId}
            catalogKey={unit.catalogKey}
            templateFn={unit.templateFn}
          />
        </div>
        <div className="w-[40px] bg-gray-500 flex-v text-white py-1">
          <div
            className="h-[40px] flex-c text-[22px] cursor-pointer"
            onClick={() => actions.removeUnit(unit.unitId)}
          >
            <Icons.DeleteBin />
          </div>
          <div
            className="grow flex-c text-[28px] cursor-pointer pb-[40px]"
            onPointerDown={(e) => handleGripPointerDown(e, unit)}
          >
            <Icons.Grip />
          </div>
          {/* <div
            className="bd-red h-[40px] flex-c text-[20px] cursor-pointer"
            onPointerDown={(e) => handleGripPointerDown(e, unit)}
          /> */}
        </div>
        {false && <PortRelativePositionDebugOverlay />}
      </div>
    </div>
  );
};
