import { useState } from "react";
import { HsUnitInstance } from "@/framework/host/host-types";
import { ReactUnitFrame } from "@/framework/unit-frame/react-unit-frame";
import { ReactUnitTemplateFn } from "@/framework/unit-frame/react-unit-interface";
import { UnitFrame } from "@/framework/unit-frame/unit-frame";
import { UnitIdsBox } from "@/host-app/organisms/unit-ids-box";

export const UnitBox = ({
  unitId,
  pageUrl,
  unitTemplateFn,
  destSpec,
}: {
  unitId: string;
  pageUrl?: string;
  unitTemplateFn?: ReactUnitTemplateFn;
  destSpec?: string | string[];
}) => {
  const [unitInstance, setUnitInstance] = useState<HsUnitInstance | null>(null);

  return (
    <UnitIdsBox
      unitId={unitId}
      numMultiOutputs={unitInstance?.portsSpec?.numMultiOutputs}
      numMultiInputs={unitInstance?.portsSpec?.numMultiInputs}
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
  );
};
