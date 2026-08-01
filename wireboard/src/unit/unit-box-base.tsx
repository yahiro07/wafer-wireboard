import clsx from "clsx";
import { npx, Point } from "mofur/ax-ui";
import { ReactNode, useMemo, useState } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { Icons } from "@/common/icons";
import { bgSpecs } from "@/common/theme";
import { unitNamesMap } from "@/main-definitions/showcase-entries";
import { actions } from "@/model/actions";
import { UnitItem } from "@/model/types";
import { PortCell } from "@/port/port-cell";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import {
  buildUnitTemporalPortsModel,
  UnitTemporalPort,
} from "@/unit/unit-temporal-ports-model";
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

export const PortsColumn = ({
  ports,
  unitPosition,
  weaken,
}: {
  ports: UnitTemporalPort[] | undefined;
  unitPosition: Point;
  weaken?: boolean;
}) => {
  const hasManyPorts = ports && ports?.length >= 4;
  return (
    <div
      className="w-[40px] relative"
      style={weaken ? { opacity: 0.1, pointerEvents: "none" } : {}}
    >
      <div
        className="absolute left-0"
        style={
          hasManyPorts
            ? { top: "50%", transform: "translateY(-50%)" }
            : { top: "calc(50% - 20px)" }
        }
      >
        {ports?.map((port) => (
          <PortCell
            key={port.portKey}
            port={port}
            unitPosition={unitPosition}
          />
        ))}
      </div>
    </div>
  );
};

export const UnitTitleRow = ({ unitItem }: { unitItem: UnitItem }) => {
  const unitTitle = unitNamesMap[unitItem.catalogKey] ?? unitItem.catalogKey;
  return (
    <div
      className={clsx(
        "h-[40px] flex-ha relative text-white px-1",
        bgSpecs.unitCardFrame,
      )}
    >
      <UnitDragGrip unitItem={unitItem} />
      <UnitDeleteButton unitItem={unitItem} />
      <div className="absolute-full flex-c pointer-events-none">
        {unitTitle}
      </div>
    </div>
  );
};

const SidePortsBox = ({
  outputPorts,
  inputPorts,
  unitPosition,
}: {
  outputPorts?: UnitTemporalPort[];
  inputPorts?: UnitTemporalPort[];
  unitPosition: Point;
}) => {
  return (
    <div className="absolute right-full h-full">
      <div className="h-full flex-v justify-between">
        <div className="flex-h flex-row-reverse">
          {outputPorts?.map((port) => (
            <PortCell
              key={port.portKey}
              port={port}
              unitPosition={unitPosition}
            />
          ))}
        </div>
        <div className="flex-h flex-row-reverse">
          {inputPorts?.map((port) => (
            <PortCell
              key={port.portKey}
              port={port}
              unitPosition={unitPosition}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SlotCardBox = ({
  unitItem,
  innerContent,
  hideInputPorts,
  hideOutputPorts,
  wireVertical,
}: {
  unitItem: UnitItem;
  innerContent?: ReactNode;
  hideInputPorts?: boolean;
  hideOutputPorts?: boolean;
  wireVertical: boolean;
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
        left: npx(unitItem.position.x),
        top: npx(unitItem.position.y),
        transform: "translate(-50%, -50%)",
        // border: "solid 1px red",
      }}
    >
      <div className="flex-h">
        {!wireVertical && (
          <PortsColumn
            ports={unitPortsModel?.inputs}
            unitPosition={unitItem.position}
            weaken={hideInputPorts}
          />
        )}
        <div
          className="relative flex-v shadow-md"
          style={{
            width: npx(sd.width),
            height: npx(sd.height),
            // border: "solid 1px blue",
          }}
        >
          {wireVertical && (
            <SidePortsBox
              outputPorts={unitPortsModel?.outputs}
              inputPorts={unitPortsModel?.inputs}
              unitPosition={unitItem.position}
            />
          )}
          <UnitTitleRow unitItem={unitItem} />
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
        {!wireVertical && (
          <PortsColumn
            ports={unitPortsModel?.outputs}
            unitPosition={unitItem.position}
            weaken={hideOutputPorts}
          />
        )}
      </div>
    </div>
  );
};
