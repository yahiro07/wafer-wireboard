import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import {
  CustomElementUnitFrameFI,
  ReactUnitFrame,
  ReactUnitTemplateFn,
  UnitFrame,
} from "wafer-host/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";
import { setupIframeInputHandlers } from "@/handlers/sight-control-handlers";

export const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
  templateFn,
  moduleUrl,
  notes,
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey?: CatalogKey;
  templateFn?: ReactUnitTemplateFn;
  moduleUrl?: string;
  notes?: number[];
}) => {
  const content: ReactNode = (() => {
    if (moduleUrl) {
      return (
        <CustomElementUnitFrameFI
          unitId={unitId}
          destSpec={destUnitId}
          scriptUrl={moduleUrl}
          inputNotes={notes}
        />
      );
    } else if (templateFn) {
      return (
        <ReactUnitFrame
          unitId={unitId}
          destSpec={destUnitId}
          unitTemplateFn={templateFn}
          inputNotes={notes}
        />
      );
    } else if (catalogKey) {
      const catalogItem = catalog[catalogKey];
      if (!catalogItem) return null;
      if (catalogItem.loaderPageUrl.endsWith("/index.js")) {
        return (
          <CustomElementUnitFrameFI
            unitId={unitId}
            destSpec={destUnitId}
            scriptUrl={catalogItem.loaderPageUrl}
            // frameSize={catalogItem.preferredSize}
            inputNotes={notes}
          />
        );
      } else {
        return (
          <UnitFrame
            unitId={unitId}
            destSpec={destUnitId}
            pageUrl={catalogItem.loaderPageUrl}
            frameSize={catalogItem.preferredSize}
            inputNotes={notes}
            onIframeMounted={setupIframeInputHandlers}
          />
        );
      }
    }
  })();
  return <ScalerBoxAutoSized>{content}</ScalerBoxAutoSized>;
};
