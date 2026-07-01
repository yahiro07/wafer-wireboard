import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import {
  CustomElementUnitFrame,
  ReactUnitFrame,
  UnitFrame,
} from "wafer-host/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";
import {
  InternalUnitKey,
  internalUnitFunctions,
} from "@/model/internal-unit-definitions";
import { setupIframeInputHandlers } from "@/presenter/sight-control-handlers";

export const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
  internalUnitKey,
  moduleUrl,
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey?: CatalogKey;
  internalUnitKey?: InternalUnitKey;
  moduleUrl?: string;
}) => {
  const content: ReactNode = (() => {
    if (moduleUrl) {
      return (
        <CustomElementUnitFrame
          unitId={unitId}
          destSpec={destUnitId}
          scriptUrl={moduleUrl}
        />
      );
    } else if (internalUnitKey) {
      const templateFn = internalUnitFunctions[internalUnitKey];
      return (
        <ReactUnitFrame
          unitId={unitId}
          destSpec={destUnitId}
          unitTemplateFn={templateFn}
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
          />
        );
      } else {
        return (
          <UnitFrame
            unitId={unitId}
            destSpec={destUnitId}
            pageUrl={catalogItem.loaderPageUrl}
            frameSize={catalogItem.preferredSize}
            onIframeMounted={setupIframeInputHandlers}
          />
        );
      }
    }
  })();
  return <ScalerBoxAutoSized>{content}</ScalerBoxAutoSized>;
};
