import { useState } from "react";
import { HsUnitInstance } from "@/framework/host/host-types";
import { ReactUnitFrame } from "@/framework/unit-frame/react-unit-frame";
import { UnitFrame } from "@/framework/unit-frame/unit-frame";
import { getDomUnitBoxId } from "@/host-app/common";
import { UnitIdsBox } from "@/host-app/organisms/unit-ids-box";
import { UnitItem } from "@/host-app/types";

export const UnitBox = ({
  unitItem: { unitId, pageUrl, unitTemplateFn, destSpec, position },
}: {
  unitItem: UnitItem;
}) => {
  const [unitInstance, setUnitInstance] = useState<HsUnitInstance | null>(null);

  return (
    <div
      id={getDomUnitBoxId(unitId)}
      key={unitId}
      className="absolute z-10"
      style={{ left: position.x, top: position.y }}
    >
      <UnitIdsBox
        unitId={unitId}
        portsSpec={unitInstance?.portsSpec}
        destSpec={destSpec}
      >
        {pageUrl && (
          <UnitFrame
            unitId={unitId}
            pageUrl={pageUrl}
            destSpec={destSpec}
            loadedCallback={setUnitInstance}
          />
        )}
        {unitTemplateFn && (
          <ReactUnitFrame
            unitId={unitId}
            unitTemplateFn={unitTemplateFn}
            destSpec={destSpec}
            loadedCallback={setUnitInstance}
          />
        )}
      </UnitIdsBox>
    </div>
  );
};
