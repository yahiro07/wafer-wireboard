import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import { HsUnitInstance } from "wafer-host/core";
import {
  ReactUnitFrame,
  UnitDestinationSpec,
  UnitFrame,
} from "wafer-host/react";
import { CatalogKey, catalog } from "@/main-definitions/showcase-entries";
import {
  InternalUnitKey,
  internalUnitFunctions,
} from "@/model/internal-unit-definitions";
import { setupIframeInputHandlers } from "@/periphery/sight-control-handlers";

export const UnitFrameEx = ({
  unitId,
  destSpec,
  catalogKey,
  internalUnitKey,
  onUnitInstanceLoaded,
}: {
  unitId: string;
  destSpec?: UnitDestinationSpec;
  catalogKey?: CatalogKey;
  internalUnitKey?: InternalUnitKey;
  onUnitInstanceLoaded?: (unitInstance: HsUnitInstance) => void;
}) => {
  const content: ReactNode = (() => {
    if (internalUnitKey) {
      const templateFn = internalUnitFunctions[internalUnitKey];
      return (
        <ReactUnitFrame
          unitId={unitId}
          destSpec={destSpec}
          unitTemplateFn={templateFn}
          onUnitInstanceLoaded={onUnitInstanceLoaded}
        />
      );
    } else if (catalogKey) {
      const catalogItem = catalog[catalogKey];
      if (!catalogItem) return null;
      return (
        <UnitFrame
          unitId={unitId}
          destSpec={destSpec}
          unitUrl={catalogItem.loaderPageUrl}
          onIframeMounted={setupIframeInputHandlers}
          onUnitInstanceLoaded={onUnitInstanceLoaded}
        />
      );
    }
  })();
  return <ScalerBoxAutoSized>{content}</ScalerBoxAutoSized>;
};
