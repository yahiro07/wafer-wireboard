import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import { ReactUnitFrame, ReactUnitTemplateFn, UnitFrame } from "wus-host/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";
import { setupIframeInputHandlers } from "@/features/main-edit-area/sight-control-handlers";

export const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
  templateFn,
  notes,
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey?: CatalogKey;
  templateFn?: ReactUnitTemplateFn;
  notes?: number[];
}) => {
  let content: ReactNode;
  if (templateFn) {
    content = (
      <ReactUnitFrame
        unitId={unitId}
        destSpec={destUnitId}
        unitTemplateFn={templateFn}
        inputNotes={notes}
      />
    );
  } else if (catalogKey) {
    content = (
      <UnitFrame
        unitId={unitId}
        destSpec={destUnitId}
        pageUrl={catalog[catalogKey].loaderPageUrl}
        frameSize={catalog[catalogKey].preferredSize}
        inputNotes={notes}
        onIframeMounted={setupIframeInputHandlers}
      />
    );
  }
  return <ScalerBoxAutoSized>{content}</ScalerBoxAutoSized>;
};
