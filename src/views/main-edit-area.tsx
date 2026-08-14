import { useEffect, useRef } from "react";
import { store } from "@/model/store";
import { setupMainAreaInputHandlers } from "@/periphery/sight-control-handlers";
import { useKeyboardAutoTarget } from "@/periphery/use-keyboard-auto-target";
import { DebugOverlay } from "@/views/debug-overlay";
import { EditorLayer } from "@/views/editor/editor-layer";
import { CornerGithubBadge } from "@/views/editor-controls/foreground-ui";
import { SharedUrlPanel } from "@/views/editor-controls/shared-url-panel";
import { SightDraggingCover } from "./editor-controls/sight-dragging-cover";
import { useMainAreaDropHandlers } from "./picker-drag-drop";

export const MainEditArea = () => {
  const { modalPanelKind } = store.useSnapshot();
  const dropHandlers = useMainAreaDropHandlers();
  const baseDivRef = useRef<HTMLDivElement>(null);
  useKeyboardAutoTarget();
  useEffect(() => {
    const baseDiv = baseDivRef.current;
    if (baseDiv) {
      return setupMainAreaInputHandlers(baseDiv);
    }
  }, []);
  return (
    <div
      className="grow relative"
      onDragOver={dropHandlers.onDragOver}
      onDrop={dropHandlers.onDrop}
      ref={baseDivRef}
    >
      <EditorLayer />
      <CornerGithubBadge side="right" />
      <SightDraggingCover />
      {false && <DebugOverlay />}
      {modalPanelKind === "share" && <SharedUrlPanel />}
    </div>
  );
};
