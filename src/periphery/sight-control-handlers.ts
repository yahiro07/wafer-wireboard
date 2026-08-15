import { actions } from "@/model/actions";
import { sightHandlers } from "@/model/sight-handlers";

export function setupMainAreaInputHandlers__deprecated(
  baseDiv: HTMLDivElement,
) {
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

function setupIframeInputHandlers_controlModeKey(iframe: HTMLIFrameElement) {
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

function setupIframeInputHandlers_pointerInput(iframe: HTMLIFrameElement) {
  const win = iframe.contentWindow as Window;
  win.addEventListener("wheel", sightHandlers.onWheel);
  win.addEventListener("pointerdown", sightHandlers.onPointerDown, {
    capture: true,
  });
  return () => {
    win.removeEventListener("wheel", sightHandlers.onWheel);
    win.removeEventListener("pointerdown", sightHandlers.onPointerDown, {
      capture: true,
    });
  };
}

export function setupIframeInputHandlers__deprecated(
  iframe: HTMLIFrameElement,
) {
  const cleanup1 = setupIframeInputHandlers_controlModeKey(iframe);
  const cleanup2 = setupIframeInputHandlers_pointerInput(iframe);
  return () => {
    cleanup1();
    cleanup2();
  };
}

export function setupIframeInputHandlers_wheel(iframe: HTMLIFrameElement) {
  const win = iframe.contentWindow as Window;
  win.addEventListener("wheel", sightHandlers.onWheel);
  return () => {
    win.removeEventListener("wheel", sightHandlers.onWheel);
  };
}
