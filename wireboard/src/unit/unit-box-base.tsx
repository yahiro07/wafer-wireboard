import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { ReactNode, useMemo, useState } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { Icons } from "@/common/icons";
import { bgSpecs } from "@/common/theme";
import { actions } from "@/model/actions";
import { UnitItem } from "@/model/types";
import { PortCell } from "@/port/port-cell";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import { buildUnitTemporalPortsModel } from "@/unit/unit-temporal-ports-model";
import { handleGripPointerDown } from "./unit-box-drag-handler";

export const UnitDeleteButton = ({ unitItem }: { unitItem: UnitItem }) => {
  return (
    <div
      className="h-[40px] flex-c text-[22px] cursor-pointer"
      onClick={() => actions.removeUnit(unitItem.unitId)}
    >
      <Icons.DeleteBin />
    </div>
  );
};

export const UnitDragGrip = ({
  unitItem,
  showIcon,
}: {
  unitItem: UnitItem;
  showIcon?: boolean;
}) => {
  return (
    <div
      className="w-full grow flex-c cursor-pointer pb-[40px]"
      onPointerDown={(e) => handleGripPointerDown(e, unitItem)}
    >
      {showIcon && <Icons.Grip size={28} />}
    </div>
  );
};

export const SlotCardBox = ({
  unitItem,
  innerContent,
}: {
  unitItem: UnitItem;
  innerContent?: ReactNode;
  excludingPortIds?: string[];
  altSidePortIds?: string[];
  hiddenPortIds?: string[];
}) => {
  const sd = { width: 400, height: 240 };
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
      <div className="flex-h">
        <div className="w-[40px] flex-vc">
          {unitPortsModel?.inputs.map((port) => (
            <PortCell
              key={port.portKey}
              port={port}
              unitPosition={unitItem.position}
            />
          ))}
        </div>
        <div
          className="relative flex-v shadow-md"
          style={{ width: npx(sd.width), height: npx(sd.height) }}
        >
          <div
            className={clsx(
              "h-[40px] flex-ha relative text-white px-1",
              bgSpecs.unitCardFrame,
            )}
          >
            <UnitDragGrip unitItem={unitItem} />
            <UnitDeleteButton unitItem={unitItem} />
            <div className="absolute-full flex-c pointer-events-none">
              {unitItem.catalogKey}
            </div>
          </div>
          <div className="grow flex-h">
            <div className={clsx("grow relative", bgSpecs.unitCardInner)}>
              <UnitFrameEx
                key={unitItem.hmrRevision}
                unitId={unitItem.unitId}
                catalogKey={unitItem.catalogKey}
                onUnitInstanceLoaded={setUnitInstance}
              />
              {innerContent}
            </div>
          </div>
        </div>
        <div className="w-[40px] flex-vc">
          {unitPortsModel?.outputs.map((port) => (
            <PortCell
              key={port.portKey}
              port={port}
              unitPosition={unitItem.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
