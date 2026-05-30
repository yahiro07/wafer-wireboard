import { npx } from "beams/ax-ui/styling-utils";
import { Icons, IconsEx } from "@/components/icons";
import { UnitFrameEx } from "@/organisms/unit-frame-ex";
import { UnitItem } from "@/store/store";

const PortCell = ({ withIcon }: { withIcon?: boolean }) => {
  return (
    <div className="w-[30px] h-[30px] bg-gray-400 cursor-pointer flex-c text-gray-100">
      {withIcon && <IconsEx.ConnectorPortUp />}
    </div>
  );
};

export const portRelativePositions = {
  outputPort: { x: 20, y: 23 },
  inputPort: { x: 20, y: 157 },
};

const PortRelativePositionDebugOverlay = () => {
  const inputPos = portRelativePositions.inputPort;
  const outputPos = portRelativePositions.outputPort;
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
  return (
    <div
      className="absolute"
      style={{ left: npx(unit.position.x), top: npx(unit.position.y) }}
    >
      <div className="relative w-[400px] h-[180px] flex-h">
        <div className="w-[40px] bg-gray-500 flex-v justify-between items-center p-2">
          <PortCell withIcon />
          <PortCell />
        </div>
        <div className="grow bg-gray-600">
          <UnitFrameEx
            unitId={unit.unitId}
            destUnitId={unit.destUnitId}
            catalogKey={unit.catalogKey}
          />
        </div>
        <div className="w-[40px] bg-gray-500 flex-c text-white text-[28px] cursor-pointer">
          <Icons.Grip />
        </div>
        {false && <PortRelativePositionDebugOverlay />}
      </div>
    </div>
  );
};
