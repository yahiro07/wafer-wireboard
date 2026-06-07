import { ScalerBoxAutoSized } from "mofur/mo-react";
import { ReactNode, useCallback } from "react";
import { ReactUnitFrame, ReactUnitTemplateFn, UnitFrame } from "wus-host/react";
import { CatalogKey, catalog } from "@/base/showcase-entries";
import { actions } from "@/store/actions";

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
  const onIframeMounted = useCallback((iframe: HTMLIFrameElement) => {
    const win = iframe.contentWindow as Window;

    const keyHandler = (e: KeyboardEvent) => {
      // console.log(`key event on iframe`, { key: e.key });
      if (e.repeat) return;
      if (e.key === "Meta" || e.key === "Control") {
        actions.setDraggingCoverVisible(e.type === "keydown");
      }
    };
    // const onWheel = () => {
    //   console.log("wheel event in iframe", { unitId });
    // };
    // const onPointerDown = () => {
    //   console.log("pointerdown event in iframe", { unitId });
    // };
    // win.addEventListener("wheel", onWheel);
    // win.addEventListener("pointerdown", onPointerDown, {
    //   capture: true,
    // });
    win.addEventListener("keydown", keyHandler);
    win.addEventListener("keyup", keyHandler);
    return () => {
      // win.removeEventListener("wheel", onWheel);
      // win.removeEventListener("pointerdown", onPointerDown, {
      //   capture: true,
      // });
      win.removeEventListener("keydown", keyHandler);
      win.removeEventListener("keyup", keyHandler);
    };
  }, []);
  let content: ReactNode;
  if (catalogKey) {
    content = (
      <UnitFrame
        unitId={unitId}
        destSpec={destUnitId}
        pageUrl={catalog[catalogKey].loaderPageUrl}
        frameSize={catalog[catalogKey].preferredSize}
        inputNotes={notes}
        onIframeMounted={onIframeMounted}
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
