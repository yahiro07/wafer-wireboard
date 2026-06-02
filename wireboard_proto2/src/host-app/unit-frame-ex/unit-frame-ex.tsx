import { ReactUnitFrame } from "@/framework/unit-frame/react-unit-frame";
import { ReactUnitTemplateFn } from "@/framework/unit-frame/react-unit-interface";
import { UnitFrame } from "@/framework/unit-frame/unit-frame";
import { UnitIdsBox } from "@/host-app/unit-frame-ex/unit-ids-box";

export const UnitFrameEx = ({
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
  return (
    <UnitIdsBox unitId={unitId} destSpec={destSpec}>
      {pageUrl && (
        <UnitFrame unitId={unitId} pageUrl={pageUrl} destSpec={destSpec} />
      )}
      {unitTemplateFn && (
        <ReactUnitFrame
          unitId={unitId}
          unitTemplateFn={unitTemplateFn}
          destSpec={destSpec}
        />
      )}
    </UnitIdsBox>
  );
};
