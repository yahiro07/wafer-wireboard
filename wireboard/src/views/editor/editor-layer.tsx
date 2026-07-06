import { boardSize, domEditAreaId } from "@/base/constants";
import { FieldSightPlane } from "@/components/field-sight-plane";
import { store } from "@/model/store";
import { SlotCardBox } from "@/unit/unit-box";
import {
  KeyboardSystemPortBox,
  SpeakerSystemPortBox,
} from "@/unit/unit-box-specials";
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

export const EditorLayer = () => {
  const { sight } = store.useSnapshot();
  return (
    <FieldSightPlane sight={sight} boardSize={boardSize}>
      <BoardEditContents />
      {false && <DebugPortsLayer />}
    </FieldSightPlane>
  );
};
