import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import {
  CustomElementUnitFrame,
  ReactUnitFrame,
  UnitFrame,
} from "wafer-host/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";
import {
  internalUnitFunctions,
  InternalUnitKey,
} from "@/model/internal-unit-definitions";
import { setupIframeInputHandlers } from "@/presenter/sight-control-handlers";

export const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
  internalUnitKey,
  moduleUrl,
  notes,
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey?: CatalogKey;
  internalUnitKey?: InternalUnitKey;
  moduleUrl?: string;
  notes?: number[];
}) => {
  const content: ReactNode = (() => {
    if (moduleUrl) {
      return (
        <CustomElementUnitFrame
          unitId={unitId}
          destSpec={destUnitId}
          scriptUrl={moduleUrl}
          inputNotes={notes}
        />
      );
    } else if (internalUnitKey) {
      const templateFn = internalUnitFunctions[internalUnitKey];
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
          <CustomElementUnitFrame
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
