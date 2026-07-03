import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import { ReactUnitFrame, UnitFrame } from "wafer-host/react";
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
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey?: CatalogKey;
  internalUnitKey?: InternalUnitKey;
}) => {
  const content: ReactNode = (() => {
    if (internalUnitKey) {
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
      return (
        <UnitFrame
          unitId={unitId}
          destSpec={destUnitId}
          unitUrl={catalogItem.loaderPageUrl}
          onIframeMounted={setupIframeInputHandlers}
        />
      );
    }
  })();
  return <ScalerBoxAutoSized>{content}</ScalerBoxAutoSized>;
};
