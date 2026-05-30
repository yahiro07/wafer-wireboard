import { ScalerBoxAutoSized } from "beams/mo-react/components/scaler-box-auto-sized";
import { UnitFrame } from "wus-host/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";
import { hostSystem } from "@/store/store";

export const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey: CatalogKey;
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
        destUnitId={destUnitId}
        pageUrl={catalog[catalogKey].loaderPageUrl}
        frameSize={frameSize}
        hostSystem={hostSystem}
        // hostBpm={state.bpm}
        // hostPlaying={state.playing}
        // onIframeMounted={onIframeMounted}
      />
    </ScalerBoxAutoSized>
  );
};
