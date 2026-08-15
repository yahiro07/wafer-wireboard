import clsx from "clsx";
import { npx } from "@/auxiliaries/helpers";
import { Point } from "@/auxiliaries/common-types";
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
import { PresetsPanel } from "@/unit/presets-panel";

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
      onPointerDown={(e) => {
        handleGripPointerDown(e, unitItem);
      }}
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
      style={weaken ? { opacity: 0.1, pointerEvents: "none" } : undefined}
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

export const PortsRow = ({
  ports,
  unitPosition,
  weaken,
}: {
  ports: UnitTemporalPort[] | undefined;
  unitPosition: Point;
  weaken?: boolean;
}) => {
  return (
    <div
      className="h-[40px] flex-h"
      style={weaken ? { opacity: 0.1, pointerEvents: "none" } : undefined}
    >
      {ports?.map((port) => (
        <PortCell key={port.portKey} port={port} unitPosition={unitPosition} />
      ))}
    </div>
  );
};

export const UnitTitleRow = ({
  unitItem,
  additionalOperationUi,
}: {
  unitItem: UnitItem;
  additionalOperationUi?: ReactNode;
}) => {
  const unitTitle = unitNamesMap[unitItem.catalogKey] ?? unitItem.catalogKey;
  return (
    <div
      className={clsx(
        "h-[40px] flex-ha relative text-white px-1",
        bgSpecs.unitCardFrame,
      )}
    >
      <UnitDragGrip unitItem={unitItem} />
      <div className="flex-ha gap-4">
        {additionalOperationUi}
        <UnitDeleteButton unitItem={unitItem} />
      </div>
      <div className="absolute-full flex-c pointer-events-none">
        {unitTitle}
      </div>
    </div>
  );
};

const LoadingOverlay = ({ loading }: { loading: boolean }) => {
  return (
    <div
      className="absolute-full bg-gray-100 flex-c pointer-events-none"
      style={{
        opacity: loading ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <Icons.Spinner className="animate-spin" size={50} color="gray" />
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
  const [unitInstance, setUnitInstance] = useState<HsUnitInstance | null>(null);
  const unitPortsModel = useMemo(
    () =>
      unitInstance ? buildUnitTemporalPortsModel(unitInstance) : undefined,
    [unitInstance],
  );
  const [presetsPanelVisible, setPresetsPanelVisible] = useState(false);
  const presetProvider = unitInstance?.presetProvider;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: npx(unitItem.position.x),
        top: npx(unitItem.position.y),
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={clsx("unevenness-box", wireVertical ? "flex-vl" : "flex-h")}
      >
        {wireVertical && (
          <PortsRow
            ports={unitPortsModel?.outputs}
            unitPosition={unitItem.position}
          />
        )}
        {!wireVertical && (
          <PortsColumn
            ports={unitPortsModel?.inputs}
            unitPosition={unitItem.position}
            weaken={hideInputPorts}
          />
        )}
        <div className="flex-v shadow-md">
          <UnitTitleRow
            unitItem={unitItem}
            additionalOperationUi={
              presetProvider && (
                <button
                  className="cursor-pointer"
                  onClick={() => setPresetsPanelVisible(!presetsPanelVisible)}
                >
                  <Icons.List />
                </button>
              )
            }
          />
          <div
            className={clsx("relative", bgSpecs.unitCardInner)}
            style={{ width: npx(360), height: npx(190) }}
          >
            <UnitFrameEx
              key={unitItem.hmrRevision}
              unitId={unitItem.unitId}
              catalogKey={unitItem.catalogKey}
              onUnitInstanceLoaded={setUnitInstance}
            />
            {innerContent}
            {presetProvider && presetsPanelVisible && (
              <PresetsPanel presetProvider={presetProvider} />
            )}
            <LoadingOverlay loading={!unitInstance} />
          </div>
        </div>
        {wireVertical && (
          <PortsRow
            ports={unitPortsModel?.inputs}
            unitPosition={unitItem.position}
          />
        )}
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
