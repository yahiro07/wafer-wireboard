import clsx from "clsx";
import { npx, Point } from "mofur/ax-ui";
import { useMemo, useState } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { Icons } from "@/common/icons";
import { actions } from "@/model/actions";
import { UnitItem } from "@/model/types";
import { PortCell } from "@/port/port-cell";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import {
  buildUnitTemporalPortsModel,
  UnitTemporalPort,
} from "@/unit/unit-temporal-ports-model";
import { handleGripPointerDown } from "./unit-box-drag-handler";

const AdditionalPortColumn = ({
  port,
  unitPosition,
}: {
  port: UnitTemporalPort;
  unitPosition: Point;
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
      {isOutput && <PortCell port={port} unitPosition={unitPosition} />}
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
      {port.portType === "additionalInput" && (
        <PortCell port={port} unitPosition={unitPosition} />
      )}
    </div>
  );
};

export const SlotCardBox = ({ unitItem }: { unitItem: UnitItem }) => {
  const sd = { width: 400, height: 180 };
  const [unitInstance, setUnitInstance] = useState<HsUnitInstance | null>(null);
  const unitPortsModel = useMemo(
    () =>
      unitInstance ? buildUnitTemporalPortsModel(unitInstance) : undefined,
    [unitInstance],
  );
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
          {unitPortsModel?.primaryOut && (
            <PortCell
              port={unitPortsModel.primaryOut}
              unitPosition={unitItem.position}
            />
          )}
          {unitPortsModel?.primaryIn && (
            <PortCell
              port={unitPortsModel.primaryIn}
              unitPosition={unitItem.position}
            />
          )}
        </div>
        <div className="grow bg-gray-600">
          <UnitFrameEx
            key={unitItem.hmrRevision}
            unitId={unitItem.unitId}
            catalogKey={unitItem.catalogKey}
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
        </div>
        {unitPortsModel?.additional && (
          <div
            className="absolute top-0 right-full h-full flex-h gap-1 mx-1 cursor-pointer"
            onPointerDown={(e) => handleGripPointerDown(e, unitItem)}
          >
            {unitPortsModel.additional.map((port) => (
              <AdditionalPortColumn
                key={port.id}
                port={port}
                unitPosition={unitItem.position}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
