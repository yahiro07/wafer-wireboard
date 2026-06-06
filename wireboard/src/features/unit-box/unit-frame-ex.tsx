import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode } from "react";
import { ReactUnitFrame, ReactUnitTemplateFn, UnitFrame } from "wus-host/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";

export const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
  templateFn,
  notes,
}: {
  unitId: string;
  destUnitId?: string;
  catalogKey?: CatalogKey;
  templateFn?: ReactUnitTemplateFn;
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
  let content: ReactNode;
  if (catalogKey) {
    content = (
      <UnitFrame
        unitId={unitId}
        destSpec={destUnitId}
        pageUrl={catalog[catalogKey].loaderPageUrl}
        frameSize={catalog[catalogKey].preferredSize}
        inputNotes={notes}
        // onIframeMounted={() => {
        //   console.log(`iframe mounted ${unitId}`);
        // }}
        // onUnitInstanceLoaded={() => {
        //   console.log(`unit instance loaded ${unitId}`);
        // }}
      />
    );
  } else if (templateFn) {
    content = (
      <ReactUnitFrame
        unitId={unitId}
        destSpec={destUnitId}
        unitTemplateFn={templateFn}
        inputNotes={notes}
      />
    );
  }
  return <ScalerBoxAutoSized>{content}</ScalerBoxAutoSized>;
};
