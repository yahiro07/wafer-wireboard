import { npx } from "mofur/ax-ui";
import { FieldSightPlane } from "@/components/field-sight-plane";
import { boardSize, domEditAreaId } from "@/main-definitions/constants";
import { store } from "@/model/store";
import { SlotCardBox } from "@/unit/unit-box";
import {
  KeyboardSystemPortBox,
  SpeakerSystemPortBox,
} from "@/unit/unit-box-specials";
import {
  WrapMixEmitterSlotCardBox,
  WrapMixReceiverSlotCardBox,
} from "@/unit/unit-box-warp-mix";
import { Connections } from "@/views/editor/connections";
import { DebugPortsLayer } from "@/views/editor/debug-ports-layer";
import { WiringLayer } from "@/views/editor/wiring-layer";
import { useWiringLayerWireItems } from "@/views/editor/wiring-layer-wire-items";

const WiringLayerContainer = () => {
  const wires = useWiringLayerWireItems();
  return <WiringLayer boardSize={boardSize} wires={wires} />;
};

const EditAreaContainer = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <div
      id={domEditAreaId}
      className="relative h-full"
      style={{ border: "solid 2px #ccc8" }}
    >
      {unitItems.map((item) => {
        if (item.unitId === "builtInKeyboard") {
          return <KeyboardSystemPortBox key={item.unitId} unit={item} />;
        } else if (item.unitId === "builtInPreOutput") {
          return <SpeakerSystemPortBox key={item.unitId} unit={item} />;
        } else if (item.catalogKey === "warpMixReceiver") {
          return (
            <WrapMixReceiverSlotCardBox key={item.unitId} unitItem={item} />
          );
        } else if (item.catalogKey === "warpMixEmitter") {
          return (
            <WrapMixEmitterSlotCardBox key={item.unitId} unitItem={item} />
          );
        } else {
          return <SlotCardBox key={item.unitId} unitItem={item} />;
        }
      })}
    </div>
  );
};

const BoardEditContents = () => {
  const { projectLoadedIndex } = store.useSnapshot();
  return (
    // this will unmount all units and connections and mount new ones for each project load
    <div className="w-full h-full" key={projectLoadedIndex}>
      <WiringLayerContainer />
      <EditAreaContainer />
      <Connections />
    </div>
  );
};

const BoardBackgroundLayer = () => {
  const color = "#6676";
  const lineWidth = 1;
  const gridPitch = 50;
  const strokeDasharray = "6 6";
  return (
    <div
      className="absolute top-0 left-0 z-[-1]"
      style={{
        width: npx(boardSize.width),
        height: npx(boardSize.height),
        border: `solid  1px ${color}`,
      }}
    >
      <svg viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}>
        <g>
          {Array.from({ length: boardSize.width / gridPitch }).map((_, i) => (
            <line
              key={i}
              x1={i * gridPitch}
              y1={0}
              x2={i * gridPitch}
              y2={boardSize.height}
              stroke={color}
              strokeWidth={lineWidth}
              strokeDasharray={strokeDasharray}
            />
          ))}
        </g>
        <g>
          {Array.from({ length: boardSize.height / gridPitch }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={i * gridPitch}
              x2={boardSize.width}
              y2={i * gridPitch}
              stroke={color}
              strokeWidth={lineWidth}
              strokeDasharray={strokeDasharray}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export const EditorLayer = () => {
  const { sight } = store.useSnapshot();
  return (
    <FieldSightPlane sight={sight} boardSize={boardSize}>
      <BoardBackgroundLayer />
      <BoardEditContents />
      {false && <DebugPortsLayer />}
    </FieldSightPlane>
  );
};
