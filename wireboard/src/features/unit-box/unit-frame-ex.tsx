import { ScalerBoxAutoSized } from "mofur/mo-react";
import { UnitFrame } from "wus-host-react/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";

export const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
  notes,
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey: CatalogKey;
  notes?: number[];
}) => {
  // const state = store.useSnapshot();
  // const onIframeMounted = useCallback((iframe: HTMLIFrameElement) => {
  //   const win = iframe.contentWindow as Window;
  //   win.addEventListener("wheel", sightHandlers.onWheel);
  //   win.addEventListener("pointerdown", sightHandlers.onPointerDown, {
  //     capture: true,
  //   });
  //   return () => {
  //     win.removeEventListener("wheel", sightHandlers.onWheel);
  //     win.removeEventListener("pointerdown", sightHandlers.onPointerDown, {
  //       capture: true,
  //     });
  //   };
  // }, []);
  const frameSize = catalog[catalogKey].preferredSize;
  return (
    <ScalerBoxAutoSized>
      <UnitFrame
        unitId={unitId}
        destSpec={destUnitId}
        pageUrl={catalog[catalogKey].loaderPageUrl}
        frameSize={frameSize}
        // onIframeMounted={onIframeMounted}
        inputNotes={notes}
      />
    </ScalerBoxAutoSized>
  );
};
