import { ScalerBoxAutoSized } from "@/components/scaler-box-auto-sized";
import { HsUnitInstance } from "wafer-host/core";
import {
  ReactUnitFrame,
  UnitDestinationSpec,
  UnitFrameScaled,
} from "wafer-host/react";
import {
  CatalogKey,
  getCatalogTarget,
} from "@/main-definitions/showcase-entries";
import { setupIframeInputHandlers_wheel } from "@/periphery/sight-control-handlers";

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
      <UnitFrameScaled
        unitId={unitId}
        destSpec={destSpec}
        unitUrl={catalogTarget.UnitInventorySpec.loaderPageUrl}
        onIframeMounted={setupIframeInputHandlers_wheel}
        onUnitInstanceLoaded={onUnitInstanceLoaded}
      />
    );
  }
  return null;
};
