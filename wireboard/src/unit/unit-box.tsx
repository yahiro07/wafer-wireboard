import clsx from "clsx";
import { npx, Point } from "mofur/ax-ui";
import { ReactNode, useMemo, useState } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { Icons } from "@/common/icons";
import { bgSpecs } from "@/common/theme";
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
        "w-[40px] h-full p-2 flex-v items-center gap-1.5",
        bgSpecs.unitCardFrame,
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

const AdditionalPortsPart = ({
  ports,
  unitItem,
  side,
}: {
  ports: UnitTemporalPort[];
  unitItem: UnitItem;
  side: "left" | "right";
}) => {
  return (
    <div
      className={clsx(
        "absolute top-0 h-full flex-h gap-1 mx-1 cursor-pointer",
        side === "left" ? "right-full" : "left-full",
      )}
      onPointerDown={(e) => handleGripPointerDown(e, unitItem)}
    >
      {ports.map((port) => (
        <AdditionalPortColumn
          key={port.id}
          port={port}
          unitPosition={unitItem.position}
        />
      ))}
    </div>
  );
};

const AdditionalPorts = ({
  ports,
  excludingPortIds,
  unitItem,
  altSidePortIds,
}: {
  ports: UnitTemporalPort[];
  excludingPortIds?: string[];
  unitItem: UnitItem;
  altSidePortIds?: string[];
}) => {
  const filteredPorts = ports.filter(
    (port) => !excludingPortIds?.includes(port.id),
  );
  const leftSidePorts = filteredPorts.filter(
    (port) => !altSidePortIds?.includes(port.id),
  );
  const rightSidePorts = filteredPorts.filter((port) =>
    altSidePortIds?.includes(port.id),
  );
  return (
    <>
      {leftSidePorts.length > 0 && (
        <AdditionalPortsPart
          ports={leftSidePorts}
          unitItem={unitItem}
          side="left"
        />
      )}
      {rightSidePorts.length > 0 && (
        <AdditionalPortsPart
          ports={rightSidePorts}
          unitItem={unitItem}
          side="right"
        />
      )}
    </>
  );
};

export const SlotCardBox = ({
  unitItem,
  innerContent,
  excludingPortIds,
  altSidePortIds,
  hiddenPortIds,
}: {
  unitItem: UnitItem;
  innerContent?: ReactNode;
  excludingPortIds?: string[];
  altSidePortIds?: string[];
  hiddenPortIds?: string[];
}) => {
  const sd = { width: 400, height: 180 };
  const [unitInstance, setUnitInstance] = useState<HsUnitInstance | null>(null);
  const unitPortsModel = useMemo(
    () =>
      unitInstance ? buildUnitTemporalPortsModel(unitInstance) : undefined,
    [unitInstance],
  );
  const primaryOutPort =
    unitPortsModel?.primaryOut &&
    !hiddenPortIds?.includes(unitPortsModel.primaryOut.id) &&
    unitPortsModel.primaryOut;
  const primaryInPort =
    unitPortsModel?.primaryIn &&
    !hiddenPortIds?.includes(unitPortsModel.primaryIn.id) &&
    unitPortsModel.primaryIn;
  return (
    <div
      className="absolute"
      style={{
        left: npx(unitItem.position.x - sd.width / 2),
        top: npx(unitItem.position.y - sd.height / 2),
      }}
    >
      <div
        className="relative flex-h shadow-md"
        style={{ width: npx(sd.width), height: npx(sd.height) }}
      >
        <div
          className={clsx(
            "w-[40px] flex-v items-center py-2",
            bgSpecs.unitCardFrame,
          )}
        >
          {primaryOutPort ? (
            <PortCell port={primaryOutPort} unitPosition={unitItem.position} />
          ) : (
            <div className="flex-c text-[24px] text-[#6ce] pointer-events-none">
              <Icons.RadioTower />
            </div>
          )}
          <div
            className="w-full grow cursor-pointer"
            onPointerDown={(e) => handleGripPointerDown(e, unitItem)}
          />
          {primaryInPort ? (
            <PortCell port={primaryInPort} unitPosition={unitItem.position} />
          ) : (
            <div />
          )}
        </div>
        <div className={clsx("grow relative", bgSpecs.unitCardInner)}>
          <UnitFrameEx
            key={unitItem.hmrRevision}
            unitId={unitItem.unitId}
            catalogKey={unitItem.catalogKey}
            onUnitInstanceLoaded={setUnitInstance}
          />
          {innerContent}
        </div>
        <div
          className={clsx(
            "w-[40px] flex-v text-white py-1",
            bgSpecs.unitCardFrame,
          )}
        >
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
          <AdditionalPorts
            ports={unitPortsModel.additional}
            unitItem={unitItem}
            excludingPortIds={excludingPortIds}
            altSidePortIds={altSidePortIds}
          />
        )}
      </div>
    </div>
  );
};
