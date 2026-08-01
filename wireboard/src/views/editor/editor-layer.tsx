import { FieldSightPlane } from "@/components/field-sight-plane";
import { boardSize, domEditAreaId } from "@/main-definitions/constants";
import { store } from "@/model/store";
import { UnitBoxRoot } from "@/unit/unit-box";
import { Connections } from "@/views/editor/connections";
import {
  DebugPortsLayer,
  DebugUnitPositionsLayer,
} from "@/views/editor/debug-ports-layer";
import { BoardBackgroundLayer } from "@/views/editor/editor-background";
import { WiringLayer } from "@/views/editor/wiring-layer";
import { useWiringLayerWireItems } from "@/views/editor/wiring-layer-wire-items";

const WiringLayerContainer = () => {
  const wires = useWiringLayerWireItems();
  return <WiringLayer boardSize={boardSize} wires={wires} />;
};

const EditAreaContainer = () => {
  const { unitItems, wireVertical } = store.useSnapshot();
  return (
    <div
      id={domEditAreaId}
      className="relative h-full"
      style={{ border: "solid 2px #ccc8" }}
    >
      {unitItems.map((item) => (
        <UnitBoxRoot
          key={item.unitId}
          item={item}
          wireVertical={wireVertical}
        />
      ))}
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
      <BoardBackgroundLayer />
      <BoardEditContents />
      {false && (
        <>
          <DebugPortsLayer />
          <DebugUnitPositionsLayer />
        </>
      )}
    </FieldSightPlane>
  );
};
