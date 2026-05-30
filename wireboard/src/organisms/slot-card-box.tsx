import { startDragSession } from "beams/ax-ui/drag-session";
import { npx } from "beams/ax-ui/styling-utils";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { Icons, IconsEx } from "@/components/icons";
import { UnitFrameEx } from "@/organisms/unit-frame-ex";
import { actions } from "@/store/actions";
import { getZoomScaling } from "@/store/helper";
import { store, UnitItem } from "@/store/store";

const PortCell = ({ withIcon }: { withIcon?: boolean }) => {
  return (
    <div className="w-[30px] h-[30px] bg-gray-400 cursor-pointer flex-c text-gray-100">
      {withIcon && <IconsEx.ConnectorPortUp />}
    </div>
  );
};

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

const handleGripPointerDown = (e0: React.PointerEvent, unit: UnitItem) => {
  const originalPosition = { ...unit.position };
  startDragSession(
    e0.nativeEvent,
    {
      onMove(e) {
        const delta = {
          x: e.position.x - e.originalPosition.x,
          y: e.position.y - e.originalPosition.y,
        };
        const sc = getZoomScaling(store.state.sight.zoom);
        const newPosition = {
          x: originalPosition.x + delta.x / sc,
          y: originalPosition.y + delta.y / sc,
        };
        actions.setUnitPosition(unit.unitId, newPosition);
      },
    },
    { coordinate: "screen" },
  );
};

export const SlotCardBox = ({ unit }: { unit: UnitItem }) => {
  return (
    <div
      className="absolute"
      style={{ left: npx(unit.position.x), top: npx(unit.position.y) }}
    >
      <div
        className="relative flex-h"
        style={{
          width: npx(slotCardDimensions.width),
          height: npx(slotCardDimensions.height),
        }}
      >
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
        <div
          className="w-[40px] bg-gray-500 flex-c text-white text-[28px] cursor-pointer"
          onPointerDown={(e) => handleGripPointerDown(e, unit)}
        >
          <Icons.Grip />
        </div>
        {false && <PortRelativePositionDebugOverlay />}
      </div>
    </div>
  );
};
