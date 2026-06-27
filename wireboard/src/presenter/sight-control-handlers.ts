import { actions } from "@/model/actions";
import { sightHandlers } from "@/model/sight-handlers";

export function setupMainAreaInputHandlers(baseDiv: HTMLDivElement) {
  const keyHandler = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key === "Meta" || e.key === "Control") {
      actions.setDraggingCoverVisible(e.type === "keydown");
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    sightHandlers.onPointerDown(e);
  };

  const onWheel = (e: WheelEvent) => {
    sightHandlers.onWheel(e);
    e.preventDefault();
  };

  window.addEventListener("keydown", keyHandler);
  window.addEventListener("keyup", keyHandler);
  window.addEventListener("pointerdown", onPointerDown, {
    capture: true,
  });
  baseDiv.addEventListener("wheel", onWheel, { passive: false });

  return () => {
    window.removeEventListener("pointerdown", onPointerDown, {
      capture: true,
    });
    window.removeEventListener("keydown", keyHandler);
    window.removeEventListener("keyup", keyHandler);
    baseDiv.removeEventListener("wheel", onWheel);
  };
}

export function setupIframeInputHandlers(iframe: HTMLIFrameElement) {
  const win = iframe.contentWindow as Window;
  const keyHandler = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key === "Meta" || e.key === "Control") {
      //Show dragging cover in main area when the key is pressed in iframe.
      //This enables controlling the sight when the pointer is on the iframe content.
      actions.setDraggingCoverVisible(e.type === "keydown");
    }
  };
  win.addEventListener("keydown", keyHandler);
  win.addEventListener("keyup", keyHandler);
  return () => {
    win.removeEventListener("keydown", keyHandler);
    win.removeEventListener("keyup", keyHandler);
  };
}
