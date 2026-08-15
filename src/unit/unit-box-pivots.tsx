import { npx } from "@/auxiliaries/helpers";
import { useMemo, useState } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { UnitItem } from "@/model/types";
import { PortsColumn, PortsRow, UnitTitleRow } from "@/unit/unit-box-base";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import { buildUnitTemporalPortsModel } from "@/unit/unit-temporal-ports-model";
import { tx } from "@twind/core";

export const PivotUnitBox = ({
  unitItem,
  wireVertical,
}: {
  unitItem: UnitItem;
  wireVertical: boolean;
}) => {
  const [unitInstance, setUnitInstance] = useState<HsUnitInstance | null>(null);
  const unitPortsModel = useMemo(
    () =>
      unitInstance ? buildUnitTemporalPortsModel(unitInstance) : undefined,
    [unitInstance],
  );
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
        className={tx(
          "relative _unevenness-box",
          wireVertical ? "flex-vl" : "flex-h",
        )}
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
          />
        )}
        <div
          className={tx(
            "flex-v w-[160px] h-[140px] shadow-md",
            "bg-clUnitCardInner",
          )}
        >
          <UnitTitleRow unitItem={unitItem} />
          <UnitFrameEx
            key={unitItem.hmrRevision}
            unitId={unitItem.unitId}
            catalogKey={unitItem.catalogKey}
            onUnitInstanceLoaded={setUnitInstance}
          />
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
          />
        )}
      </div>
    </div>
  );
};
