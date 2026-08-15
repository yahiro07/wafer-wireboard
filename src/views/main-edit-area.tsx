import { store } from "@/model/store";
import { useKeyboardAutoTarget } from "@/periphery/use-keyboard-auto-target";
import { DebugOverlay } from "@/views/debug-overlay";
import { EditorLayer } from "@/views/editor/editor-layer";
import { CornerGithubBadge } from "@/views/editor-controls/foreground-ui";
import { SharedUrlPanel } from "@/views/editor-controls/shared-url-panel";
import { useMainAreaDropHandlers } from "./picker-drag-drop";
import { sightHandlers } from "@/model/sight-handlers";
import { domEditAreaId } from "@/main-definitions/constants";
import { ScalingGaugeContainer } from "@/views/editor-controls/scaling-gauge";

export const MainEditArea = () => {
  const { modalPanelKind } = store.useSnapshot();
  const dropHandlers = useMainAreaDropHandlers();
  useKeyboardAutoTarget();
  return (
    <div
      className="grow relative"
      onDragEnter={dropHandlers.onDragEnter}
      onDragOver={dropHandlers.onDragOver}
      onDrop={dropHandlers.onDrop}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).id !== domEditAreaId) return;
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
      <ScalingGaugeContainer />
      {/* <SightDraggingCover /> */}
      {false && <DebugOverlay />}
      {modalPanelKind === "share" && <SharedUrlPanel />}
    </div>
  );
};
