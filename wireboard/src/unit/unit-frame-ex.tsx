import { ScalerBoxAutoSized } from "mofur/mo-react";
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
  baseAspectRatio,
}: {
  unitId: string;
  destSpec?: UnitDestinationSpec;
  catalogKey: CatalogKey;
  onUnitInstanceLoaded?: (unitInstance: HsUnitInstance) => void;
  baseAspectRatio?: number;
}) => {
  const catalogTarget = getCatalogTarget(catalogKey);
  if (catalogTarget?.type === "internal") {
    return (
      <ScalerBoxAutoSized overflow="visible">
        <ReactUnitFrame
          unitId={unitId}
          destSpec={destSpec}
          unitTemplateFn={catalogTarget.internalUnitFunction}
          onUnitInstanceLoaded={onUnitInstanceLoaded}
        />
      </ScalerBoxAutoSized>
    );
  } else if (catalogTarget?.type === "catalog") {
    return (
      <ScalerBoxAutoSized>
        <UnitFrame
          unitId={unitId}
          destSpec={destSpec}
          unitUrl={catalogTarget.UnitInventorySpec.loaderPageUrl}
          onIframeMounted={setupIframeInputHandlers}
          onUnitInstanceLoaded={onUnitInstanceLoaded}
          baseAspectRatio={baseAspectRatio}
        />
      </ScalerBoxAutoSized>
    );
  }
  return null;
};
