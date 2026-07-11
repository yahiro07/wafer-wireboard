import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { useMemo, useState } from "react";
import { HsUnitInstance } from "wafer-host/core";
import { bgSpecs } from "@/common/theme";
import { UnitItem } from "@/model/types";
import { PortsColumn, UnitTitleRow } from "@/unit/unit-box-base";
import { UnitFrameEx } from "@/unit/unit-frame-ex";
import { buildUnitTemporalPortsModel } from "@/unit/unit-temporal-ports-model";

export const PivotUnitBox = ({ unitItem }: { unitItem: UnitItem }) => {
  const sd = { width: 220, height: 140 };
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
        className="relative flex-h shadow-md"
        style={{ width: npx(sd.width), height: npx(sd.height) }}
      >
        <PortsColumn
          ports={unitPortsModel?.inputs}
          unitPosition={unitItem.position}
        />
        <div className={clsx("grow flex-v", bgSpecs.unitCardInner)}>
          <UnitTitleRow unitItem={unitItem} />
          <UnitFrameEx
            key={unitItem.hmrRevision}
            unitId={unitItem.unitId}
            catalogKey={unitItem.catalogKey}
            onUnitInstanceLoaded={setUnitInstance}
          />
        </div>
        <PortsColumn
          ports={unitPortsModel?.outputs}
          unitPosition={unitItem.position}
        />
      </div>
    </div>
  );
};
