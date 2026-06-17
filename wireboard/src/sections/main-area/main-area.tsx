import { useEffect, useRef } from "react";
import { store } from "@/central/store";
import { EditorLayer } from "@/editor/editor-layer";
import { CornerGithubBadge, InfoButton } from "@/editor-controls/foreground-ui";
import { SceneSwitcherBar } from "@/editor-controls/scene-switcher-bar";
import { TopControlBar } from "@/editor-controls/top-control-bar";
import { setupMainAreaInputHandlers } from "@/handlers/sight-control-handlers";
import { useKeyboardAutoTarget } from "@/handlers/use-keyboard-auto-target";
import { SightDraggingCover } from "../../editor-controls/sight-dragging-cover";
import { useMainAreaDropHandlers } from "../../handlers/picker-drag-drop";

export const MainArea = () => {
  const { sceneSwitcherVisible } = store.useSnapshot();
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
      <InfoButton />
      <CornerGithubBadge />
      <TopControlBar />
      <SightDraggingCover />
      {sceneSwitcherVisible && <SceneSwitcherBar />}
    </div>
  );
};
