import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import { HsUnitInstance } from "wafer-host/core";
import {
  ReactUnitFrame,
  UnitDestinationSpec,
  UnitFrame,
} from "wafer-host/react";
import {
  CatalogKey,
  getCatalogTarget,
} from "@/main-definitions/showcase-entries";
import { setupIframeInputHandlers } from "@/periphery/sight-control-handlers";

export const UnitFrameEx = ({
  unitId,
  destSpec,
  catalogKey,
  onUnitInstanceLoaded,
}: {
  unitId: string;
  destSpec?: UnitDestinationSpec;
  catalogKey: CatalogKey;
  onUnitInstanceLoaded?: (unitInstance: HsUnitInstance) => void;
}) => {
  const content: ReactNode = (() => {
    const catalogTarget = getCatalogTarget(catalogKey);
    if (catalogTarget?.type === "internal") {
      return (
        <ReactUnitFrame
          unitId={unitId}
          destSpec={destSpec}
          unitTemplateFn={catalogTarget.internalUnitFunction}
          onUnitInstanceLoaded={onUnitInstanceLoaded}
        />
      );
    } else if (catalogTarget?.type === "catalog") {
      return (
        <UnitFrame
          unitId={unitId}
          destSpec={destSpec}
          unitUrl={catalogTarget.UnitInventorySpec.loaderPageUrl}
          onIframeMounted={setupIframeInputHandlers}
          onUnitInstanceLoaded={onUnitInstanceLoaded}
        />
      );
    }
    return null;
  })();
  return <ScalerBoxAutoSized>{content}</ScalerBoxAutoSized>;
};
