import { useRef } from "react";
import { store } from "@/model/store";
import { useKeyboardAutoTarget } from "@/periphery/use-keyboard-auto-target";
import { DebugOverlay } from "@/views/debug-overlay";
import { EditorLayer } from "@/views/editor/editor-layer";
import { CornerGithubBadge } from "@/views/editor-controls/foreground-ui";
import { SharedUrlPanel } from "@/views/editor-controls/shared-url-panel";
import { SightDraggingCover } from "./editor-controls/sight-dragging-cover";
import { useMainAreaDropHandlers } from "./picker-drag-drop";
import { sightHandlers } from "@/model/sight-handlers";

export const MainEditArea = () => {
  const { modalPanelKind } = store.useSnapshot();
  const dropHandlers = useMainAreaDropHandlers();
  const baseDivRef = useRef<HTMLDivElement>(null);
  useKeyboardAutoTarget();
  return (
    <div
      className="grow relative"
      onDragOver={dropHandlers.onDragOver}
      onDrop={dropHandlers.onDrop}
      ref={baseDivRef}
      onPointerDown={(e) => {
        sightHandlers.onPointerDown(e.nativeEvent);
        // e.stopPropagation();
        // e.preventDefault();
      }}
      onWheel={(e) => {
        sightHandlers.onWheel(e.nativeEvent);
        // e.stopPropagation();
        // e.preventDefault();
      }}
    >
      <EditorLayer />
      <CornerGithubBadge side="right" />
      <SightDraggingCover />
      {false && <DebugOverlay />}
      {modalPanelKind === "share" && <SharedUrlPanel />}
    </div>
  );
};
