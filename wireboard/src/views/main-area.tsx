import { useEffect, useRef } from "react";
import { store } from "@/model/store";
import { setupMainAreaInputHandlers } from "@/presenter/sight-control-handlers";
import { useKeyboardAutoTarget } from "@/presenter/use-keyboard-auto-target";
import { EditorLayer } from "@/views/editor/editor-layer";
import { CornerGithubBadge } from "@/views/editor-controls/foreground-ui";
import { SceneSwitcherBar } from "@/views/editor-controls/scene-switcher-bar";
import { TopBar } from "@/views/editor-controls/top-bar";
import { useMainAreaDropHandlers } from "../presenter/picker-drag-drop";
import { SightDraggingCover } from "./editor-controls/sight-dragging-cover";

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
    <div className="grow flex-v">
      <TopBar />
      <div
        className="grow relative"
        onDragOver={dropHandlers.onDragOver}
        onDrop={dropHandlers.onDrop}
        ref={baseDivRef}
      >
        <EditorLayer />
        <CornerGithubBadge />
        <SightDraggingCover />
        {sceneSwitcherVisible && <SceneSwitcherBar />}
      </div>
    </div>
  );
};
