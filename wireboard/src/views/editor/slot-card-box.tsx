import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { Icons } from "@/base/icons";
import { slotCardDimensions } from "@/base/slot-card-dimensions";
import { actions } from "@/model/actions";
import { UnitItem } from "@/model/types";
import {
  UnitTemporalPort,
  useSlotCardBoxViewModel,
} from "@/presenter/slot-card-box-view-model";
import { InputPortCell, OutputPortCell } from "@/views/editor/port-cell";
import { UnitFrameEx } from "@/views/editor/unit-frame-ex";
import { handleGripPointerDown } from "../../presenter/common-card-handlers";

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

const AdditionalPortColumn = ({
  port,
  unitItem,
}: {
  port: UnitTemporalPort;
  unitItem: UnitItem;
}) => {
  const isOutput = port.portType === "additionalOutput";

  return (
    <div
      key={port.id}
      className={clsx(
        "w-[40px] h-full bg-gray-500 p-2 flex-v items-center gap-1.5",
        isOutput ? "justify-start" : "justify-end",
      )}
    >
      {isOutput && <OutputPortCell unit={unitItem} />}
      <div
        className={clsx(
          "text-white text-[14px] leading-none whitespace-nowrap",
        )}
        style={{
          writingMode: "vertical-rl",
          textOrientation: "sideways",
          transform: "rotate(180deg)",
        }}
      >
        {port.label ?? port.id}
      </div>
      {port.portType === "additionalInput" && <InputPortCell />}
    </div>
  );
};

export const SlotCardBox = ({ unitItem }: { unitItem: UnitItem }) => {
  const sd = slotCardDimensions;
  const { unitPortsModel, setUnitInstance } = useSlotCardBoxViewModel(unitItem);

  return (
    <div
      className="absolute"
      style={{
        left: npx(unitItem.position.x - sd.width / 2),
        top: npx(unitItem.position.y - sd.height / 2),
      }}
    >
      <div
        className="relative flex-h"
        style={{ width: npx(sd.width), height: npx(sd.height) }}
      >
        <div
          className="w-[40px] bg-gray-500 flex-v justify-between items-center p-2 cursor-pointer"
          onPointerDown={(e) => handleGripPointerDown(e, unitItem)}
        >
          {unitPortsModel?.primaryOut && <OutputPortCell unit={unitItem} />}
          {unitPortsModel?.primaryIn && <InputPortCell />}
        </div>
        <div className="grow bg-gray-600">
          <UnitFrameEx
            key={unitItem.fileChangeRevision}
            unitId={unitItem.unitId}
            destUnitId={unitItem.destUnitId}
            catalogKey={unitItem.catalogKey}
            internalUnitKey={unitItem.internalUnitKey}
            onUnitInstanceLoaded={setUnitInstance}
          />
        </div>
        <div className="w-[40px] bg-gray-500 flex-v text-white py-1">
          <div
            className="h-[40px] flex-c text-[22px] cursor-pointer"
            onClick={() => actions.removeUnit(unitItem.unitId)}
          >
            <Icons.DeleteBin />
          </div>
          <div
            className="grow flex-c text-[28px] cursor-pointer pb-[40px]"
            onPointerDown={(e) => handleGripPointerDown(e, unitItem)}
          >
            <Icons.Grip />
          </div>
          {/* <div
            className="bd-red h-[40px] flex-c text-[20px] cursor-pointer"
            onPointerDown={(e) => handleGripPointerDown(e, unit)}
          /> */}
        </div>
        {false && <PortRelativePositionDebugOverlay />}
        {unitPortsModel?.additional && (
          <div className="absolute top-0 right-full h-full flex-h gap-1 mx-1">
            {unitPortsModel.additional.map((port) => (
              <AdditionalPortColumn
                key={port.id}
                port={port}
                unitItem={unitItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
